
# %%
import pandas as pd
from pathlib import Path
from anytree import Node, RenderTree
import anytree
import itertools
from anytree.exporter import JsonExporter
from anytree.search import find as find_nodes
import json


def create_root_node(name: str) -> anytree.Node:
    return Node(name=name)


def add_node(
    node_name: str,
    parent: anytree.Node,
    to_root: bool = False,
    **kwargs
):

    already_existing_node = find_nodes(
        node=parent.root,
        filter_=lambda node: node.name == node_name)

    # print()
    # print('already_existing_node: ', already_existing_node)
    # print()

    # If node does not exist in tree ..
    if already_existing_node is None:

        # .. add new node, which is also the new parent
        return Node(
            name=node_name, parent=parent, value=333)

    else:
        # Don't add new node, and keep current parent
        return already_existing_node.path[-1]


def create_radial_tree_datastructure_from_df(
        df: pd.DataFrame,
        root: anytree.Node
) -> anytree.Node:
    '''
    Creates a tree-like datastructure, using the anytree-library and an input dataframe with single index and several columns. Each column of the dataframe represents a set of nodes, starting with the first set of children nodes in the most left column. Hence, the most right column only consists of leaf nodes, without further descendents.

    Parameter
    -------
    df: pd.DataFrame
        Inherits the tree data structure

    root: anytree.Node
        Named root node

    Returns
    -------
    anytree.Node
        Filled up tree structure.

    '''

    column_names_except_last = [
        col_name for col_name in df.columns[:-1].values]

    # Set all columns except last as index, then slice groups out of them
    groups = df.set_index(column_names_except_last).groupby(
        column_names_except_last, as_index=True)

    # print('groups: ', groups)
    parent = root

    i = 0

    # Iter over groups and build up tree structure
    for group_names, group_df in groups:
        print("-" * 100)
        # print('group_df: ', group_df)
        print()
        print('group_names: ', group_names)
        print()

        # Use this dummy to search for existing

        # Connect first child to root and every following child to the last
        # added one
        for enum, name in enumerate(group_names):
            print('name: ', name)
            print('parent BEFORE: ', parent)

            # if enum == 0:

            # If first entry of group_names tuple is not yet a child of
            # root, add it
            parent = add_node(
                parent=parent, node_name=group_names[enum],
            )

            print('parent AFTER: ', parent)
            print()
            # else:
            #     # Only add new children if you can't find a child with the same
            #     # name
            #     print('group_names[enum]: ', group_names[enum])
            #     print()
            #     _ = add_node(
            #         parent=parent, node_name=group_names[enum],
            #     )

        # Helper function to unpack a list of list
        flatten = itertools.chain.from_iterable

        # Due to the appropiate grouping, all entries from the last column have
        # the last_added_node as its parent
        for entry in list(flatten(group_df.values)):

            # No need to save last added nodes since those are leaf nodes
            _ = add_node(
                parent=parent, node_name=entry,
            )

        # Reset parent to root
        # parent = parent.ancestors[-1]
        # i += 1
        # if i == 2:
        #     break

    return root


# //////////////////////////////////////////////////////////////////////////////
# Load excel data
df = pd.read_excel(
    Path("C:/Code/bio-economy-cluster/backend/database/excel/Search_scheme/branchen_scheme_2.xlsx")
)

# Create radial tree structure
radial_tree_datastructure = create_radial_tree_datastructure_from_df(
    df=df,
    root=create_root_node(name="Bio"))

# Create anytree json export
exporter = JsonExporter(indent=4, sort_keys=False)
radial_tree_json = exporter.export(radial_tree_datastructure)
print("-" * 100)
# print('radial_tree_json: ', radial_tree_json[:1650])


with open('tree_WKO.json', 'a') as f:
    f.write(radial_tree_json)

# print(RenderTree(radial_tree_datastructure))
# print('radial_tree_datastructure: ', radial_tree_datastructure)
print(exporter.export(radial_tree_datastructure))

# %%
