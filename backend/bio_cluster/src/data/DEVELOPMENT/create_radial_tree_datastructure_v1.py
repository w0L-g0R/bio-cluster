
# %%
import pandas as pd
from pathlib import Path
from anytree import Node, RenderTree
import anytree
import itertools


# %%
df = pd.read_excel(
    Path("C:/Code/bio-economy-cluster/backend/database/excel/Search_scheme/branchen_scheme.xlsx")
)

# %%


def create_root_node(name: str) -> anytree.Node:
    return Node(name=name)


def mark_last_added_node(parent: anytree.Node, node_name: str, **kwargs):

    # if anytree.search.find(
    #         node=root,
    #         filter_=lambda node: node.name == group_names[enum],
    #         maxlevel=1) is None:

    if anytree.search.find(
            node=parent,
            filter_=lambda node: node.name == node_name,
            maxlevel=1) is None:

        # last_added_node = Node(
        #     name=group_names[enum], parent=root, value=333)

        return Node(
            name=node_name, parent=parent, value=333)


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

    column_names_except_last = [val for val in df.columns[:-1].values]
    print('column_names_except_last: ', column_names_except_last)

    # Set all columns except last as index, then slice groups out of them
    groups = df.set_index(column_names_except_last).groupby(
        column_names_except_last)

    # Iter over groups and build up tree structure
    for group_names, group_df in groups:
        print('group_names: ', group_names)

        # Use this dummy to search for existing
        last_added_node = None

        # Connect first child to root and every next child to last added child
        for enum, name in enumerate(group_names):
            print(enum)
            # print(RenderTree(root))

            # If first entry of group_names tuple is not a child of root, add it
            # otherwise skip
            if enum == 0:

                last_added_node = mark_last_added_node(
                    parent=root, node_name=group_names[enum],
                )

                # if anytree.search.find(
                #         node=root,
                #         filter_=lambda node: node.name == group_names[enum],
                #         maxlevel=1) is None:

                #     last_added_node = Node(
                #         name=group_names[enum], parent=root, value=333)
            else:
                # Only add new children if you can't find one with the same
                # name

                last_added_node = mark_last_added_node(
                    parent=last_added_node, node_name=group_names[enum],
                )

                # if anytree.search.find(
                #         node=last_added_node,
                #         filter_=lambda node: node.name == group_names[enum],
                #         maxlevel=1) is None:

                #     last_added_node = Node(
                # name=group_names[enum], parent=last_added_node, value=10)

        # Add all entries from last column to the corresponding parents
        for entry in list(itertools.chain.from_iterable(group_df.values)):
            # Only add a new children if you can't find one with the same name
            if anytree.search.find(
                    node=last_added_node,
                    filter_=lambda node: node.name == entry,
                    maxlevel=1) is None:

                _ = Node(
                    name=entry, parent=last_added_node, value=99999)

    return root

# %%


create_radial_tree_datastructure_from_df(
    root=create_root_node(name="Bioökonomie"))


# %%
print(RenderTree(root))

# %%


# for col in column_names_except_last:
#     print("-" * 23)
#     print('col: ', col)
#     g = _df.groupby(level=col)

#     for name, subgroup in g:
#         node = Node(name=name, parent=root)
#         print("+" * 23)
#         print()
#         print('subgroup: ', subgroup["layer_3"])
#         print()
#         print('name: ', name)

# for group in subgroup["layer_3"]:
# print()
# print('group: ', group)
