# server.py
from flask import Flask, request, jsonify
from sqlalchemy import create_engine, Column, String, DateTime, PrimaryKeyConstraint, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from datetime import datetime
import os
from dotenv import load_dotenv
import base64
from client import EquipmentDocumentProcessor
# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize the EquipmentDocumentProcessor with necessary IDs and endpoints
processor = EquipmentDocumentProcessor(
    project_id=os.getenv('PROJECT_ID'),
    location=os.getenv('LOCATION'),
    processor_id=os.getenv('PROCESSOR_ID')
)

# Database configuration
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_PORT = os.getenv('DB_PORT')

# SQLAlchemy setup
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the database model
class EquipmentRecord(Base):
    __tablename__ = 'equipment_records'
    
    manufacturer = Column(String(255), nullable=False)
    model = Column(String(255), nullable=False)
    serial_number = Column(String(255), nullable=False)
    equipment_name = Column(String(255))
    installation_date = Column(String(255))
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        PrimaryKeyConstraint('manufacturer', 'model', 'serial_number'),
    )

# Create tables
Base.metadata.create_all(bind=engine)

# API endpoints
@app.route('/iris_equipment_records', methods=['POST'])
def add_equipment():
    data = request.json
    db = SessionLocal()
    try:
        equipment = EquipmentRecord(**data)
        db.merge(equipment)  # merge will update if exists, insert if not
        db.commit()
        return jsonify({"message": "Equipment record updated successfully"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@app.route('/iris_equipment_records', methods=['GET'])
def get_equipment():
    manufacturer = request.args.get('manufacturer')
    model = request.args.get('model')
    serial_number = request.args.get('serial_number')
        
    db = SessionLocal()
    try:
        query = db.query(EquipmentRecord)
        if manufacturer:
            query = query.filter(EquipmentRecord.manufacturer == manufacturer)
        if model:
            query = query.filter(EquipmentRecord.model == model)
        if serial_number:
            query = query.filter(EquipmentRecord.serial_number == serial_number)
            
        records = query.all()
        return jsonify([{
            "manufacturer": record.manufacturer,
            "model": record.model,
            "serial_number": record.serial_number,
            "equipment_name": record.equipment_name,
            "installation_date": record.installation_date,
            "last_updated": record.last_updated.isoformat()
        } for record in records]), 200
    finally:
        db.close()

@app.route('/upload_archi_image_to_iris', methods=['POST'])
def upload_image():
    data = request.json
    try:
        if 'image' not in data:
            return jsonify({"error": "No image provided"}), 400

        # Decode the base64 image
        image_data = base64.b64decode(data['image'])
        result_document = processor.process_image_from_bytes(image_data)

        processed_result = result_document.text if hasattr(result_document, 'text') else "Processing failed"


        # Send back the result to the client
        return jsonify({"processed_data": processed_result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)