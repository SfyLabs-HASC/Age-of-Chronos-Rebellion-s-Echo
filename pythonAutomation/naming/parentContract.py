import os

# Ottieni il percorso completo del file corrente (childContract.py)
full_path = os.path.realpath(__file__)
# Estrai il percorso della directory del file corrente e il nome del file
path, filename = os.path.split(full_path)
# Risali di tre directory per arrivare alla directory di lavoro di AgeOfChronos
AgeOfChronos_path = os.path.abspath(os.path.join(path, "../../"))

print("Percorso di lavoro di AgeOfChronos:", AgeOfChronos_path)

# Definisco i dati per i contratti parent
data = [
    ["TimeSquadAria", "Aria Zephyrion - Age Of Chronos", "ARIAZEPHYRION"],
    ["TimeSquadLuna", "Luna Stronghold - Age Of Chronos", "LUNASTRONGHOLD"],
    ["TimeSquadRyker", "Ryker Blade - Age Of Chronos", "RYKERBLADE"],
    ["TimeSquadThaddeus", "Thaddeus Luckstride - Age Of Chronos", "THADDEUSLUCKSTRIDE"]
]

# Percorso del file di riferimento
reference_file_path = os.path.join(AgeOfChronos_path, 'contracts', 'parent', 'TimeSquadRyker.sol')

# Percorso della directory di output
output_dir = os.path.join(AgeOfChronos_path, 'contracts', 'parent')
os.makedirs(output_dir, exist_ok=True)

# Leggi il contenuto del file di riferimento
with open(reference_file_path, 'r') as file:
    reference_content = file.read()

# Genera i nuovi file con le sostituzioni
for contract_name, full_name, symbol in data:
    new_content = reference_content.replace('TimeSquadRyker', contract_name)
    new_content = new_content.replace('Ryker Blade - Age Of Chronos', full_name)
    new_content = new_content.replace('RYKERBLADE', symbol)
    
    new_file_path = os.path.join(output_dir, f'{contract_name}.sol')
    with open(new_file_path, 'w') as new_file:
        new_file.write(new_content)

print(f'Creati {len(data)} file .sol nella directory {output_dir}')
