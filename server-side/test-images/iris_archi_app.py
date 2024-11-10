from google.cloud import documentai_v1 as documentai
from google.api_core.client_options import ClientOptions
from dataclasses import dataclass, asdict
from typing import Optional
import os
import io
from PIL import Image
from datetime import datetime
from sqlalchemy import create_engine, Column, String, DateTime, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func

# Create the SQLAlchemy base class
Base = declarative_base()

# Define the database model with composite primary key
class EquipmentRecord(Base):
    __tablename__ = 'equipment_records'
    
    # All fields made non-nullable for primary key fields
    manufacturer = Column(String, nullable=False)
    model = Column(String, nullable=False)
    serial_number = Column(String, nullable=False)
    
    # Other fields
    equipment_name = Column(String)
    installation_date = Column(String)
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Define composite primary key
    __table_args__ = (
        PrimaryKeyConstraint('manufacturer', 'model', 'serial_number'),
    )

# Define the equipment data structure based on required fields
@dataclass
class EquipmentInfo:
    equipment_name: Optional[str] = ""    # Equipment Name
    installation_date: Optional[str] = "" # Installation Date
    manufacturer: Optional[str] = ""      # Manufacturer
    model: Optional[str] = ""             # Model
    serial_number: Optional[str] = ""     # Serial Number

class EquipmentDocumentProcessor:
    def __init__(self, project_id: str, location: str, processor_id: str, db_url: str = "sqlite:///equipment.db"):
        """Initialize the Document AI processor and database connection."""
        self.client, self.processor_name = self._initialize_client(project_id, location, processor_id)
        self.engine = create_engine(db_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)

    def _initialize_client(self, project_id: str, location: str, processor_id: str):
        """Initialize Document AI client with project and processor details."""
        opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
        client = documentai.DocumentProcessorServiceClient(client_options=opts)
        processor_name = client.processor_path(project_id, location, processor_id)
        return client, processor_name

    def process_image(self, file_path: str) -> documentai.Document:
        """Process the image using Document AI."""
        with Image.open(file_path) as img:
            if img.mode == 'RGBA':
                img = img.convert('RGB')
            buffer = io.BytesIO()
            img.save(buffer, format='JPEG', quality=95)
            file_content = buffer.getvalue()

        raw_document = documentai.RawDocument(content=file_content, mime_type='image/jpeg')
        request = documentai.ProcessRequest(name=self.processor_name, raw_document=raw_document)
        
        try:
            result = self.client.process_document(request=request)
            return result.document
        except Exception as e:
            raise Exception(f"Error processing document: {str(e)}")

    def extract_equipment_info(self, document: documentai.Document) -> EquipmentInfo:
        """Extract required fields based on custom labels."""
        info = EquipmentInfo()
        for entity in document.entities:
            entity_type = entity.type_
            text_value = entity.normalized_value.text if entity.normalized_value.text else entity.mention_text
            
            # Map extracted data to the appropriate dataclass fields
            if entity_type == "Equipment_Name":
                info.equipment_name = text_value
            elif entity_type == "Installation_date":
                info.installation_date = text_value
            elif entity_type == "Manufacturer":
                info.manufacturer = text_value
            elif entity_type == "Model":
                info.model = text_value
            elif entity_type == "Serial_Number":
                info.serial_number = text_value

        return info

    def update_database(self, equipment_info: EquipmentInfo):
        """Update the database with the extracted information."""
        session = self.Session()
        try:
            # Verify all primary key fields are present
            if not all([equipment_info.manufacturer, equipment_info.model, equipment_info.serial_number]):
                raise ValueError("Missing required primary key fields (manufacturer, model, or serial_number)")

            # Convert equipment_info to dict
            info_dict = asdict(equipment_info)
            
            # Check if record exists using composite key
            existing_record = session.query(EquipmentRecord).filter_by(
                manufacturer=info_dict['manufacturer'],
                model=info_dict['model'],
                serial_number=info_dict['serial_number']
            ).first()
            
            if existing_record:
                # Update existing record
                for key, value in info_dict.items():
                    setattr(existing_record, key, value)
            else:
                # Create new record
                new_record = EquipmentRecord(**info_dict)
                session.add(new_record)
            
            session.commit()
            print(f"Database updated successfully for equipment:\n"
                  f"Manufacturer: {info_dict['manufacturer']}\n"
                  f"Model: {info_dict['model']}\n"
                  f"Serial Number: {info_dict['serial_number']}")
            
        except Exception as e:
            session.rollback()
            raise Exception(f"Error updating database: {str(e)}")
        finally:
            session.close()

    def save_results(self, equipment_info: EquipmentInfo):
        """Save the extracted information to a file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"equipment_info_{timestamp}.txt"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("Equipment Inspection Report\n")
            f.write("=" * 50 + "\n")
            f.write(f"Processing Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("-" * 50 + "\n\n")
            
            for field, value in asdict(equipment_info).items():
                f.write(f"{field.replace('_', ' ').title()}: {value or 'Not found'}\n")

        print(f"Results saved to file: {output_file}")

    def query_equipment(self, manufacturer: Optional[str] = None, 
                       model: Optional[str] = None, 
                       serial_number: Optional[str] = None):
        """Query the database for equipment records."""
        session = self.Session()
        try:
            query = session.query(EquipmentRecord)
            
            if manufacturer:
                query = query.filter(EquipmentRecord.manufacturer == manufacturer)
            if model:
                query = query.filter(EquipmentRecord.model == model)
            if serial_number:
                query = query.filter(EquipmentRecord.serial_number == serial_number)
                
            return query.all()
        finally:
            session.close()

def main():
    # Replace these with your actual configuration details
    project_id = "iris-junction-2024"  # Replace with your project ID
    location = "eu"  # Replace with your processor location
    processor_id = "eb0fd4f82722a5c3"  # Replace with your OCR processor ID
    image_path = "PXL_20241109_213627528.jpg" 
    
    try:
        # Initialize the document processor
        processor = EquipmentDocumentProcessor(project_id, location, processor_id)
        
        print("Processing document...")
        document = processor.process_image(image_path)
        
        # Extract and display the equipment information
        equipment_info = processor.extract_equipment_info(document)
        
        print("\nExtracted Equipment Information:")
        print("=" * 50)
        for field, value in asdict(equipment_info).items():
            print(f"{field.replace('_', ' ').title()}: {value or 'Not found'}")
        
        # Update the database
        processor.update_database(equipment_info)
        
        # Save the results to a file
        processor.save_results(equipment_info)
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()