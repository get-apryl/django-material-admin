import os

from setuptools import find_packages, setup

with open(os.path.join(os.path.dirname(__file__), 'README.rst')) as readme:
    README = readme.read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))


setup(
    name="django-material-admin",
    version="2021.11.30",
    license='MIT License',
    packages=find_packages(),
    author=["Anton Maistrenko", "Melvyn Sopacua"],
    include_package_data=True,
    author_email=["it2015maistrenko@gmail.com", "melvyn@oviavo.com"],
    description="Material Design For Oviavo's Backoffice",
    long_description=README,
    url="https://github.com/oviavo/django-material-admin",
    classifiers=[
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        'Framework :: Django :: 3.2',
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
