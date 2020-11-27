
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
        return

    def __repr__(self):
        return self.name


def create_root_node(name: str) -> TreeNode:
    return Node(name=name)


# def add_node(
#     node_name: str,
#     parent: TreeNode,
#     to_root: bool = False,
#     **kwargs
# ):

#     already_existing_node = find_nodes(
#         node=parent.root,
#         filter_=lambda node: node.name == node_name)

#     # print()
#     # print('already_existing_node: ', already_existing_node)
#     # print()

#     # If node does not exist in tree ..
#     if already_existing_node is None:

#         # .. add new node, which is also the new parent
#         return Node(
#             name=node_name, parent=parent, value=333)

#     else:
#         # Don't add new node, and keep current parent
#         return already_existing_node.path[-1]


def create_radial_tree_datastructure_from_df(
        df: pd.DataFrame,
        root: TreeNode
) -> TreeNode:
    '''
    Creates a tree-like datastructure, using the anytree-library and an input dataframe with single index and several columns. Each column of the dataframe represents a set of nodes, starting with the first set of children nodes in the most left column. Hence, the most right column only consists of leaf nodes, without further descendents.

    Parameter
    -------
    df: pd.DataFrame
        Inherits the tree data structure

    root: TreeNode
        Named root node

    Returns
    -------

    TreeNode
        Tree structure.

    '''

    tree = root

    def mark_nodes_and_leafs(column):

        column_idx = columns_with_layers.index(column.name)

        # In the last layer a cell either has value and is a LEAF or it remains
        # NaN
        if column_idx == len(columns_with_layers) - 1:
            return pd.Series(
                data=np.where(
                    column.isna(),
                    column,
                    "LEAF"),
                index=column.index)
        else:

            # Extract next column to the right to lookup rows with NaN values
            next_column_to_the_right = df[[
                columns_with_layers[column_idx + 1]]].squeeze()

            # If there's a NaN value in the cell of the next right column, then
            # mark the cell in this column as LEAF, otherwise it's a NODE
            return pd.Series(
                data=np.where(
                    next_column_to_the_right.isna(),
                    "LEAF",
                    "NODE",
                ),
                index=column.index)

    def create_nodes_and_leafs(column):
        print('column: ', column)
        print()
        # print('row: ', row.name)
        # print('row: ', row)

        # tree_blueprint = df_tree_blueprint[column.name]

        # tree.children = [Node(name=)
        # row.where(tree_blueprint == "LEAF")
        # print()
        # last_added_node = Node(
        #     name=row[0], parent=root, value=333)

        # print('last_added_node.children: ', last_added_node.children)
        # parent = root

        # def fill_branch_recursively(cell):

        #     # print('parent: ', parent.children)

        #     # BASE CASE:
        #     if isinstance(cell, str):
        #         if find_nodes(node=parent,
        #                       filter_=lambda node: node.name == cell) is None:
        #             # LEAF
        #             Node(name=cell, parent=parent, value=333)

        #         else:
        #             return fill_branch_recursively(
        #                 cell=next(tree_blueprint.values))

        if column.name == columns_with_layers[0]:

            _ = [Node(name=cell, parent=root, value=333)
                 for cell in column.unique()]
        else:

            col_index = columns_with_layers.index(column.name) - 1
            # print('last_index: ', last_index)

            # fill_branch_recursively(cell=tree_blueprint[0])
            for cell in column.unique():  # .where(tree_blueprint == "NODE"):
                if isinstance(cell, str):

                    row_index = column[column == cell].index[0]

                    parent = df.iloc[row_index, col_index]
                    f = find_by_attr(tree, parent)
                    print('f: ', f)
                    print('parent: ', parent)
                    # s = df[columns_with_layers[last_index]]
                    # df.query( == "foo"')
                    # print('s: ', s)

                    # print(s.loc[df[''].isin(['one','three'])])

                    Node(name=cell, parent=f, value=333)

                #     # print('node: ', node)

        #     if find_nodes(
        #             node=root,
        #             filter_=lambda node: node.name == cell) is None:

        #         Node(name=cell, parent=, value=333)

        #         #             parent = Node(
            #                 name=cell, parent=parent, value=333)
            #             print('parent: ', parent)
            #             print()

            #         else:

            # f = find_nodes(
            #     node=tree,
            #     filter_=lambda node: node.name == cell,
            # )

            # print('f: ', f)
            # print('node: ', node)

            #     last_added_node = Node(
            #         name=node, parent=last_added_node, value=333)

            #     print('last_added_node: ', last_added_node)

            # Extract the names of all columns that contains "layer" in
            # the name
    columns_with_layers = [l for l in df.columns if "layer" in l]

    # Create a df copy that contains only layer columns and write
    # into each cell wheter it is a NODE,LEAF or NaN cell ( -> cells in the
    # last layer that aren't leafs)
    # df_tree_blueprint = df[columns_with_layers].apply(
    #     mark_nodes_and_leafs
    # )

    # print('df_tree_blueprint: ', df_tree_blueprint)

    # Iter over rows in the original dataframe and build the tree from root to
    # leaf in each row
    df[columns_with_layers].apply(
        create_nodes_and_leafs
    )

    print('tree.children: ', tree.children)

    return tree


# //////////////////////////////////////////////////////////////////////////////
# Load excel data
df = pd.read_excel(
    Path("C:/Code/bio-economy-cluster/backend/database/excel/Search_scheme/branchen_scheme_2.xlsx")
)

# Create radial tree structure
radial_tree_datastructure = create_radial_tree_datastructure_from_df(
    df=df,
    root=create_root_node(name="Bio")
)

# # Create anytree json export
exporter = JsonExporter(indent=4)
radial_tree_json = exporter.export(radial_tree_datastructure)
# print("-" * 100)
# # print('radial_tree_json: ', radial_tree_json[:1650])

# with open('tree_WKO.json', 'a') as f:
#     f.write(radial_tree_json)

print(RenderTree(radial_tree_datastructure))
# # print('radial_tree_datastructure: ', radial_tree_datastructure)
# print(exporter.export(radial_tree_datastructure))

# %%
