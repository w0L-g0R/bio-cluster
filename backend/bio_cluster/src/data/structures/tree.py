
# %%
import pandas as pd
from pathlib import Path
from anytree import Node, NodeMixin, RenderTree
from anytree.exporter import JsonExporter
from anytree.search import find as find_nodes
from anytree.search import find_by_attr
import json
import numpy as np
from functools import reduce


class TreeNode(NodeMixin):

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
        return f"{self.name}"


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

        # Columns that contain layer information (including leaf layer)
        self.layer_columns = [l for l in df.columns if "layer" in l]

        # Columns that includes additional data (flags, item, description,etc.)
        self.info_columns = [d for d in df.columns if not "layer" in d]

        # Df that indicates wheter a cell is a node or a leaf.
        # NOTE: Leaves get stored with the original string values,
        # while nodes gets labeled with "NODE".
        self.blueprint = self.df[self.layer_columns].apply(
            self.mark_nodes_and_leafs
        )

        # Build tree from root to leafs column-wise
        self.df[self.layer_columns].apply(
            self.create_nodes_and_leafs
        )

    def create_nodes_and_leafs(self, column: pd.Series):

        # First layer behaves differently
        if column.name == self.layer_columns[0]:

            # Get the column index of the passed column
            col_index = self.layer_columns.index(column.name)

            # Iter over unique cells in column
            for cell in column.unique():

                # If the cell
                row_index = column[column == cell].index[0]

                # Add a new node to the root of the tree
                new_node = TreeNode(
                    name=cell,
                    # Parent of first layer is always the root (here:
                    # self.tree)
                    parent=self.tree,
                )
                # Common arguments for all nodes including leafs
                # Make a key value pair and let each cell know to which
                # layer it relates
                setattr(
                    new_node, "layer_id", int(
                        column.name.split("_")[1]))
                # setattr(new_node, "description",
                #         df["description"].iloc[row_index])

                # Private arguments for leaf, no other nodes
                # In case this cell is a leaf, add any given attached data
                self.add_infos_to_leaf(
                    node=new_node,
                    cell=cell,
                    row_index=row_index,
                    col_index=col_index
                )

        else:

            col_index = self.layer_columns.index(column.name) - 1

            for cell in column.unique():

                # Exclude NaN cells?
                # TODO: Check for behaviour for numbers
                # NOTE: Why not checking the if condition above?
                if isinstance(cell, str):

                    # TODO: Check if that works with just column.index[0]
                    row_index = column[column == cell].index[0]

                    # Add a new node to the root of the tree
                    new_node = TreeNode(
                        name=cell,
                        # Find the node's parent from the root to the current
                        parent=find_by_attr(
                            node=self.tree,
                            value=self.df.iloc[
                                row_index,
                                col_index
                            ],
                        )
                    )

                    # Common arguments for all nodes including leafs
                    # Make a key value pair and let each cell know to which
                    # layer it relates
                    setattr(
                        new_node, "layer_id", int(
                            column.name.split("_")[1]))

                    # Private arguments for leaf, no other nodes
                    # In case this cell is a leaf, add any given attached data
                    self.add_infos_to_leaf(
                        node=new_node,
                        cell=cell,
                        row_index=row_index,
                        col_index=col_index + 1
                    )

    def add_infos_to_leaf(self, node, cell, row_index, col_index):

        # If the cell is a leaf, then it is marked with the the original cell
        # name in the blueprint.
        if cell == self.blueprint.iloc[
            row_index,
            col_index
        ]:

            # Iter over all info columns in the row of the cell
            for info_column in self.info_columns:

                # Write the info data for the cell into a variable
                value = self.df[info_column].iloc[row_index]

                # Make key and value pair from current column name and
                # corresponding data variable and pass it to the node object
                setattr(node, info_column, value)

    def mark_nodes_and_leafs(self, column):
        ''' Used to create a blueprint of the input data that depicts each cell as a node ("NODE") of children (original data string) '''

        # Get index fom column list
        column_idx = self.layer_columns.index(column.name)

        # All objects in last layer must be Leafs
        if column_idx == len(self.layer_columns) - 1:
            return column

        else:
            # Extract next column to the right to lookup rows with NaN values
            next_column_to_the_right = self.df[
                [self.layer_columns[column_idx + 1]]
            ].squeeze()

            # If there is no NaN value to the right, mark the cell in
            # this column as "NODE"
            return pd.Series(
                data=np.where(
                    next_column_to_the_right.isna(),
                    column,
                    "NODE",
                ),
                index=column.index)

    def to_json(self, destination: str, show: bool = False):
        # Create anytree json export
        json_file = JsonExporter(
            indent=4).export(
            self.tree).replace(
            "NaN",
            "null")

        with open(destination, 'w') as f:
            f.write(json_file)

        if show:
            return print(json_file)

    def render(self):
        return print(RenderTree(self.tree))
