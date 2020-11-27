from pathlib import Path
from typing import Union, List


def get_list_of_files_in_directory(
        directory: Union[Path, str], subdirectories: bool = False) -> List:

    dirpath = Path(directory)
    assert dirpath.is_dir(), "Not a directory path!"

    file_list = []

    for x in dirpath.iterdir():

        if x.is_file():
            file_list.append(x)

        # Iter recursivly through subdirectories
        elif x.is_dir():
            if subdirectories:
                file_list.extend(
                    get_list_of_files_in_directory(
                        directory=x, subdirectories=True))

    return file_list
