import os
import json
import zipfile
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# Config
ZIP_PATH = "../archive.zip"
EXTRACT_DIR = "./dataset"
TRAIN_DIR = os.path.join(EXTRACT_DIR, "Train")
MODEL_SAVE_PATH = "disease_model.pt"
CLASS_INDICES_PATH = "class_indices.json"
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def extract_dataset():
    if not os.path.exists(TRAIN_DIR):
        print(f"Extracting {ZIP_PATH} to {EXTRACT_DIR}...")
        with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
            zip_ref.extractall(EXTRACT_DIR)
        print("Extraction complete.")
    else:
        print("Dataset already extracted.")

def train():
    extract_dataset()
    
    print("Setting up data transformations...")
    # Transforms
    data_transforms = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    full_dataset = datasets.ImageFolder(TRAIN_DIR, transform=data_transforms)
    
    # Save class mapping
    class_names = full_dataset.classes
    idx_to_class = {i: name for i, name in enumerate(class_names)}
    with open(CLASS_INDICES_PATH, "w") as f:
        json.dump(idx_to_class, f, indent=4)
    print(f"Saved class mapping to {CLASS_INDICES_PATH}")
    
    # Split train/val
    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(full_dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)
    
    num_classes = len(class_names)
    print(f"Found {num_classes} classes.")
    
    print("Building model...")
    # Build model (MobileNetV2)
    model = models.mobilenet_v2(weights='DEFAULT')
    
    # Freeze layers
    for param in model.parameters():
        param.requires_grad = False
        
    # Replace classifier
    model.classifier[1] = nn.Linear(model.last_channel, num_classes)
    
    model = model.to(DEVICE)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=0.001)
    
    print(f"Starting training on {DEVICE}...")
    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            
        epoch_loss = running_loss / len(train_dataset)
        
        # Validation
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
                outputs = model(inputs)
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
                
        val_acc = 100 * correct / total
        print(f"Epoch {epoch+1}/{EPOCHS} - Loss: {epoch_loss:.4f} - Val Acc: {val_acc:.2f}%")
        
    print(f"Saving model to {MODEL_SAVE_PATH}...")
    torch.save(model, MODEL_SAVE_PATH)
    print("Training complete! You can now use the local model in your API.")

if __name__ == "__main__":
    train()
