# %%
import pandas as pd
from pathlib import Path
from get_list_of_files_in_directory import get_list_of_files_in_directory

file_list = get_list_of_files_in_directory(
    directory=Path(
        "C:/Code/bio_cluster/backend/bio_cluster/src/database/excel/Datenbank_nach_Branchen")
)

df = pd.DataFrame(
    columns=[
        "branche_layer_01",
        "branche_layer_02",
        "branche_layer_03",
        "locality_layer_01",
        "locality_layer_02",
        "company_name",
        "street",
        "zip_code",
        "locality"])

# Collect dataframes from files
dfs = []
_sum_rows = 0
for enum, file in enumerate(file_list):
    print('file: ', str(file).split("WKO_")[1])
    _df = pd.read_excel(io=file, header=0)

    _sum_rows += len(_df)
    dfs.append(_df)

print('_sum: ', _sum)
df = pd.concat((df for df in dfs))
# %%
# print('df: ', df)
df.reset_index(inplace=True)
del df['index']

print('df: ', df.head())
print('df: ', len(df))

# # %%
# df.to_pickle(Path(
#     "C:/Code/bio-economy-cluster/backend/database/excel/Datenbank_nach_Branchen/full_business_db.pkl")
# )
# # %%
# g = df[df.duplicated(subset=['company_name'])]
# g = g.sort_values(by=['company_name'])
# g
# print('g: ', g)

# # %%
# df.to_excel(Path(
#     "C:/Code/bio-economy-cluster/backend/database/excel/Datenbank_nach_Branchen/full_business_db_duplicates.xlsx")
# )

# %%
