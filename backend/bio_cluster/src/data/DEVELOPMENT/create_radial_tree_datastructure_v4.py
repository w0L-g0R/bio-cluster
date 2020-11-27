
# %%
import pandas as pd
from pathlib import Path
from anytree import Node, NodeMixin, RenderTree
# import anytree
# import itertools
from anytree.exporter import JsonExporter
from anytree.search import find as find_nodes
from anytree.search import find_by_attr
import json
import numpy as np


class TreeNode(NodeMixin):  # Add Node feature

    def __init__(
        self,
        name="Bio",
        flag_LT=None,
        item=None,
        parent=None,
        children=None
    ):

        super(TreeNode, self).__init__()
        self.name = name
        self.flag_LT = flag_LT
        self.item = item
        self.parent = parent
        if children:
            self.children = children

    def __repr__(self):
        return f"{self.name} - Item: {self.item} - LT: {self.flag_LT}"


class TreeStructure:

    def __init__(
        self,
        name: str,
        df: pd.DataFrame,
        root: TreeNode
    ):

        self.name = name
        self.tree = root
        self.df = df
        self.layer_columns = [l for l in df.columns if "layer" in l]
        self.data_columns = [d for d in df.columns if not "layer" in d]

        self.blueprint = self.df[self.layer_columns].apply(
            self.mark_nodes_and_leafs
        )

        # Iter over rows in the input df and build the tree from root to
        # leafs breadth-wise
        self.df[self.layer_columns].apply(
            self.create_nodes_and_leafs
        )

    def create_nodes_and_leafs(self, column: pd.Series):

        # Treat first layer differently
        if column.name == self.layer_columns[0]:

            col_index = self.layer_columns.index(column.name)

            for cell in column.unique():

                row_index = column[column == cell].index[0]

                self.add_data_to_leaf(
                    node=TreeNode(
                        name=cell,
                        parent=self.tree,
                    ),
                    cell=cell,
                    row_index=row_index,
                    col_index=col_index
                )

        else:

            col_index = self.layer_columns.index(column.name) - 1

            for cell in column.unique():
                if isinstance(cell, str):

                    row_index = column[column == cell].index[0]

                    self.add_data_to_leaf(
                        node=TreeNode(
                            name=cell,
                            parent=find_by_attr(
                                node=self.tree,
                                value=df.iloc[
                                    row_index,
                                    col_index
                                ],
                            )
                        ),
                        cell=cell,
                        row_index=row_index,
                        col_index=col_index + 1
                    )

    def add_data_to_leaf(self, node, cell, row_index, col_index):

        if cell == self.blueprint.iloc[
            row_index,
            col_index
        ]:

            for data_column in self.data_columns:
                value = df[data_column].iloc[row_index]
                setattr(node, data_column, value)

    def mark_nodes_and_leafs(self, column):

        # Get index fom column list
        column_idx = self.layer_columns.index(column.name)

        # All objects in last layer must be Leafs
        if column_idx == len(self.layer_columns) - 1:
            return column

        else:
            # Extract next column to the right to lookup rows with NaN values
            next_column_to_the_right = df[
                [self.layer_columns[column_idx + 1]]
            ].squeeze()

            # If a no NaN value appears to the right, then mark the cell in
            # this column as "NODE"
            return pd.Series(
                data=np.where(
                    next_column_to_the_right.isna(),
                    column,
                    "NODE",
                ),
                index=column.index)

    def to_json(self, filename: str = "tree_WKO.json"):
        # Create anytree json export
        json_file = JsonExporter(
            indent=4).export(
            self.tree).replace(
            "NaN",
            "null")

        with open(filename, 'w') as f:
            f.write(json_file)

        return print(json_file)
        # radial_tree_json = exporter.export(radial_tree_datastructure)

    def render(self):
        return print(RenderTree(self.tree))

# print("-" * 100)
# # print('radial_tree_json: ', radial_tree_json[:1650])


# with open('tree_WKO.json', 'w') as f:
#     f.write(radial_tree_json.replace("NaN", "null"))

# print(RenderTree(radial_tree_datastructure))

# def create_radial_tree_datastructure_from_df(
#         df: pd.DataFrame,
#         tree: TreeNode
# ) -> TreeNode:
#     '''
# Creates a tree-like datastructure, using the anytree-library and an
# input dataframe with single index and several columns. Each column of
# the dataframe represents a set of nodes, starting with the first set of
# children nodes in the most left column. Hence, the most right column
# only consists of leaf nodes, without further descendents.

#     Parameter
#     -------
#     df: pd.DataFrame
#         Inherits the tree data structure

#     root: TreeNode
#         Named root node

#     Returns
#     -------

#     TreeNode
#         Tree structure.

#     '''

#     def add_data_to_leaf(node, cell, row_index, col_index):

#         if cell == blueprint.iloc[
#             row_index,
#             col_index
#         ]:

#             for data_column in data_columns:
#                 value = df[data_column].iloc[row_index]
#                 setattr(node, data_column, value)

#     def mark_nodes_and_leafs(column):

#         # Get index fom column list
#         column_idx = layer_columns.index(column.name)

#         # All objects in last layer must be Leafs
#         if column_idx == len(layer_columns) - 1:
#             return column

#         else:
#             # Extract next column to the right to lookup rows with NaN values
#             next_column_to_the_right = df[
#                 [layer_columns[column_idx + 1]]
#             ].squeeze()

#             # If a no NaN value appears to the right, then mark the cell in
#             # this column as "NODE"
#             return pd.Series(
#                 data=np.where(
#                     next_column_to_the_right.isna(),
#                     column,
#                     "NODE",
#                 ),
#                 index=column.index)

#     def create_nodes_and_leafs(column):

#         if column.name == layer_columns[0]:

#             col_index = layer_columns.index(column.name)

#             for cell in column.unique():

#                 row_index = column[column == cell].index[0]

#                 add_data_to_leaf(
#                     node=TreeNode(
#                         name=cell,
#                         parent=tree,
#                     ),
#                     cell=cell,
#                     row_index=row_index,
#                     col_index=col_index
#                 )

#         else:

#             col_index = layer_columns.index(column.name) - 1

#             for cell in column.unique():
#                 if isinstance(cell, str):

#                     row_index = column[column == cell].index[0]

#                     add_data_to_leaf(
#                         node=TreeNode(
#                             name=cell,
#                             parent=find_by_attr(
#                                 node=tree,
#                                 value=df.iloc[
#                                     row_index,
#                                     col_index
#                                 ],
#                             )
#                         ),
#                         cell=cell,
#                         row_index=row_index,
#                         col_index=col_index + 1
#                     )

#     return tree


# //////////////////////////////////////////////////////////////////////////////
# Load excel data
df = pd.read_excel(
    Path("C:/Code/bio-economy-cluster/backend/database/excel/Search_scheme/branchen_scheme_2.xlsx"),


)

# Create radial tree structure
# radial_tree_datastructure = create_radial_tree_datastructure_from_df(
#     df=df,
#     tree=TreeNode(name="Bio")
# )

radial_tree_datastructure = TreeStructure(
    name="Business",
    df=df,
    root=TreeNode(name="Bio")
)

# radial_tree_datastructure.to_json()
radial_tree_datastructure.render()

# # print('radial_tree_datastructure: ', radial_tree_datastructure)
# print(exporter.export(radial_tree_datastructure))

# %%
