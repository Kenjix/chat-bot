python -m venv venv
pip install -r requirements.txt
pip freeze
python manage.py makemigrations
python manage.py migrate