from setuptools import setup
from setuptools import find_packages

setup(
    name='bio_cluster',
    version='1.0',
    description='bio cluster backend in development stage',
    author='WGO',
    packages=find_packages('src'),
    package_dir={'': 'src'},
)
