# %%
import pandas as pd
from pathlib import Path
import json
import re

pd.set_option('display.max_rows', 1000)
# %%
# TODO: replace with mock db path
wko_branchen_gesamt = Path(
    "C:/Code/bio_cluster/backend/bio_cluster/src/database/excel/Datenbank_nach_Branchen/WKO_database_branchen_gesamt.xlsx")

mock_db_dir_path = Path(
    "C:/Code/bio_cluster/frontend/bio_cluster/src/app/data/mocks/database/WKO/companies/")

df = pd.read_excel(io=wko_branchen_gesamt)

# %%
selected_cols = [
    "branche_layer_2",
    "branche_layer_3",
    # "locality_layer_1",
    # "locality_layer_2",
    "company_name",
]

# Cut columns that arent needed
df = df[selected_cols]
df["id"] = df.index
# %%
groups = df.groupby("branche_layer_3")

# Loop over groups and create json files
for name, group in groups:
    print('group: ', group)

    cleaned_name = name.translate(
        {ord(c): "" for c in r"!@#$%^&*()[]{};:,./<>?\|`~-=_+"})

    cleaned_name = cleaned_name.translate({ord(c): "_" for c in " "})

    # with open(mock_db_dir_path / f'{cleaned_name}.json', 'w') as file:
    #     group.to_json(file, orient="records", indent=4)


# %%

# duplicated_mask = df["company_name"].duplicated()
# duplicated_df = df[duplicated_mask].sort_values(by="company_name")
# duplicated_df.head(100)

# %%
# _df = df.iloc[:5000, :]
groups = duplicated_df.head(100).groupby([
    # "branche_layer_2",
    # "branche_layer_3",
    "company_name"
])


# for name, group in groups:
#     if len(group) > 1:

#         if len(group["branche_layer_3"].unique()) > 1:
#             # display(name)
#             # display(group)
#             display(f"Gruppe: {name} - Anzahl Unternehmen: {len(group)}")
