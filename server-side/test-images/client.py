# client.py
from google.cloud import documentai_v1 as documentai
from google.api_core.client_options import ClientOptions
from dataclasses import dataclass, asdict
from typing import Optional
import os
import io
from PIL import Image
import requests
from datetime import datetime
import json

@dataclass
class EquipmentInfo:
    equipment_name: Optional[str] = ""
    installation_date: Optional[str] = ""
    manufacturer: Optional[str] = ""
    model: Optional[str] = ""
    serial_number: Optional[str] = ""

class EquipmentDocumentProcessor:
    def __init__(self, project_id: str, location: str, processor_id: str, api_url: str = "http://localhost:5000"):
        """Initialize the Document AI processor and API connection."""
        self.client, self.processor_name = self._initialize_client(project_id, location, processor_id)
        self.api_url = api_url

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
        
    def process_image_from_bytes(self, image_bytes: bytes) -> documentai.Document:
        """Process the image using Document AI."""
        with Image.open(io.BytesIO(image_bytes)) as img:
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
        """Update the database through the API."""
        if not all([equipment_info.manufacturer, equipment_info.model, equipment_info.serial_number]):
            raise ValueError("Missing required primary key fields (manufacturer, model, or serial_number)")

        try:
            response = requests.post(
                f"{self.api_url}/equipment",
                json=asdict(equipment_info),
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            print("Database updated successfully")
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error updating database: {str(e)}")

    def query_equipment(self, manufacturer: Optional[str] = None, 
                       model: Optional[str] = None, 
                       serial_number: Optional[str] = None):
        """Query the equipment database through the API."""
        params = {}
        if manufacturer:
            params['manufacturer'] = manufacturer
        if model:
            params['model'] = model
        if serial_number:
            params['serial_number'] = serial_number

        try:
            response = requests.get(f"{self.api_url}/equipment", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error querying database: {str(e)}")

def main():
    project_id = "iris-junction-2024"
    location = "eu"
    processor_id = "eb0fd4f82722a5c3"
    image_path = "IMG_2316.JPG"
    
    try:
        processor = EquipmentDocumentProcessor(project_id, location, processor_id)
        
        print("Processing document...")
        document = processor.process_image(image_path)
        equipment_info = processor.extract_equipment_info(document)
        
        print("\nExtracted Equipment Information:")
        print("=" * 50)
        for field, value in asdict(equipment_info).items():
            print(f"{field.replace('_', ' ').title()}: {value or 'Not found'}")
        
        # Update the database
        processor.update_database(equipment_info)
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()