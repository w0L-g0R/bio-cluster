import pandas as pd
from pathlib import Path
import math as m
import numpy as np


def clean_and_convert_xlsx_scheme_to_json(path):

    filename = path.stem
    print('filename: ', filename)

    if "tree_scheme" in filename:

        # Fetch and convert excel
        df = pd.read_excel(path)

        # Mask specific colums
        cols_to_check = [col for col in df.columns if "layer" in col]

        for col in cols_to_check:

            # 1) Search for and remove "(gesamt)"
            if df[col].str.contains("(gesamt)", na=False).any():
                df[col] = df[col].apply(lambda x: x.split(
                    "(")[0] if isinstance(x, str) else x)

            # # 2) Change "Floristen (Blumenbinder und Blumeneinzelhändler)"
            # if df[col].str.contains(
            #         "Floristen (Blumenbinder und Blumeneinzelhändler)", na=False).any():
            #     df[col] = df[col].apply(lambda x:
            #                             "Floristen Blumenbinder und Blumeneinzelhändler"
            #                             )
            # # 2) Change "Floristen (Blumenbinder und Blumeneinzelhändler)"
            # if df[col].str.contains(
            #         "Landschaftsgärtner (Garten - und Grünflächengestalter)",
            #         na=False).any():
            #     df[col] = df[col].apply(lambda x:
            #                             "Landschaftsgärtner Garten - und Grünflächengestalter"
            #                             )

        return df
