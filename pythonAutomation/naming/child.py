import pandas as pd
import os

full_path = os.path.realpath(__file__)
path, filename = os.path.split(full_path)


data = [
    ["AriaBody", "BODY - Aria Zephyrion", "BDAZ"],
    ["AriaHead", "HEAD - Aria Zephyrion", "HDAZ"],
    ["AriaLeftHand", "LEFT HAND - Aria Zephyrion", "LHAZ"],
    ["AriaRightHand", "RIGHT HAND - Aria Zephyrion", "RHAZ"],
    ["LunaBody", "BODY - Luna Stronghold", "BDLS"],
    ["LunaHead", "HEAD - Luna Stronghold", "HDLS"],
    ["LunaLeftHand", "LEFT HAND - Luna Stronghold", "LHLS"],
    ["LunaRightHand", "RIGHT HAND - Luna Stronghold", "RHLS"],
    ["RykerBody", "BODY - Ryker Blade", "BDRB"],
    ["RykerHead", "HEAD - Ryker Blade", "HDRB"],
    ["RykerLeftHand", "LEFT HAND - Ryker Blade", "LHRB"],
    ["RykerRightHand", "RIGHT HAND - Ryker Blade", "RHRB"],
    ["ThaddeusBody", "BODY - Thaddeus Luckstride", "BDTL"],
    ["ThaddeusHead", "HEAD - Thaddeus Luckstride", "HDTL"],
    ["ThaddeusLeftHand", "LEFT HAND - Thaddeus Luckstride", "LHTL"],
    ["ThaddeusRightHand", "RIGHT HAND - Thaddeus Luckstride", "RHTL"]
]


df = pd.DataFrame(data, columns=["NomeContratto", "NomeCompleto", "Simbolo"])


# Define the absolute path for the output directory
csv_dir = os.path.join(path, 'namingChild','lol')
os.makedirs(csv_dir, exist_ok=True)
print(csv_dir)

df.to_csv(csv_dir+"fdsa.csv", index=False)