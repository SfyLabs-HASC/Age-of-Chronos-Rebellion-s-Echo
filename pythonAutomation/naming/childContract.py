import os

full_path = os.path.realpath(__file__)
path, filename = os.path.split(full_path)
AgeOfChronos_path = os.path.abspath(os.path.join(path, "../../"))
print("ciao a tutti")
print(AgeOfChronos_path)
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

# Percorso del file di riferimento
reference_file_path = AgeOfChronos_path+'\\contracts\\child'

# Percorso della directory di output
output_dir = reference_file_path
print(output_dir)
# Leggi il contenuto del file di riferimento
with open(reference_file_path+'\\AriaBody.sol', 'r') as file:
    reference_content = file.read()

# Genera i nuovi file con le sostituzioni
for contract_name, full_name, symbol in data:
    new_content = reference_content.replace('AriaBody', contract_name)
    new_content = new_content.replace('BODY - Aria Zephyrion', full_name)
    new_content = new_content.replace('BDAZ', symbol)
    
    new_file_path = os.path.join(output_dir, f'{contract_name}.sol')
    with open(new_file_path, 'w') as new_file:
        new_file.write(new_content)

print(f'Creati {len(data)} file .sol nella directory {output_dir}')
