from data.utils.convert_xlsx_schema_to_json import clean_and_convert_xlsx_scheme_to_json

from data.structures.tree import TreeStructure, TreeNode

from pathlib import Path
import pandas as pd

# //////////////////////////////////////////////////////////////////////////////
# Load excel data


# p = Path("C:/Code/bio_cluster/backend/bio_cluster/src/database/excel/Schemes/test_tree_scheme.xlsx")

radial_schema_xlsx = Path(
    "C:/Code/bio_cluster/backend/bio_cluster/src/database/excel/Schemes/radial_tree_scheme_v0.xlsx")

df = clean_and_convert_xlsx_scheme_to_json(path=radial_schema_xlsx)

db_schema_folder = Path(
    "C:/Code/bio_cluster/frontend/bio_cluster/src/app/data/mocks/database/WKO/radial_tree_scheme.json")
# df = pd.read_excel(
#     Path("C:/Code/bio_cluster/backend/bio_cluster/src/database/excel/Schemes/test_scheme.xlsx"),
# )

# radial_tree_datastructure = TreeStructure(
#     name="Busines_mini",
#     df=df,
#     root=TreeNode(name="Bio")
# )

radial_tree_datastructure = TreeStructure(
    name="Busines",
    df=df,
    root=TreeNode(name="Bio")
)

radial_tree_datastructure.to_json(destination=db_schema_folder)
radial_tree_datastructure.render()
