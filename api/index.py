import sys
from pathlib import Path

# Add project root and backend directory to sys.path so 'app' imports work
current_dir = Path(__file__).resolve().parent
root_dir = current_dir.parent
backend_dir = root_dir / "backend"

for directory in (str(backend_dir), str(root_dir)):
    if directory not in sys.path:
        sys.path.insert(0, directory)

from app.main import app
