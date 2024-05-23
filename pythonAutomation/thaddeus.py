import json
import os
import numpy as np


FILES = 10000

def generate_json_files(base_json, attack_mean, attack_std_dev, defence_mean, defence_std_dev, magic_value, fortune_mean, fortune_std_dev, output_subdir):
    global FILES 
    # Generate random attributes
    attack_values = gaussian_random(attack_mean, attack_std_dev, 1, 5, FILES)
    defence_values = gaussian_random(defence_mean, defence_std_dev, 1, 10, FILES)
    magic_values = [magic_value] * FILES  # Magic is always 0
    fortune_values = gaussian_random(fortune_mean, fortune_std_dev, 50, 70, FILES)

    # Define the absolute path for the output directory
    output_dir = os.path.join(path, 'output', output_subdir)
    os.makedirs(output_dir, exist_ok=True)
    print(output_dir)

    # Generate FILES JSON files with modified attributes
    for i in range(1, FILES+1):
        new_json = base_json.copy()
        new_json["name"] = f"{base_json['name'].split('#')[0]}#{i}"
        new_json["attributes"][0]["value"] = str(attack_values[i-1])
        new_json["attributes"][1]["value"] = str(defence_values[i-1])
        new_json["attributes"][2]["value"] = str(magic_values[i-1])
        new_json["attributes"][3]["value"] = str(fortune_values[i-1])

        with open(os.path.join(output_dir, f'{i}.json'), 'w') as f:
            json.dump(new_json, f, indent=4)

    print(f"Finished generating {FILES} JSON files in {output_subdir}.")

# Function to create Gaussian distributed random numbers
def gaussian_random(mean, std_dev, min_val, max_val, size):
    values = np.random.normal(loc=mean, scale=std_dev, size=size)
    values = np.clip(values, min_val, max_val)
    return values.astype(int)

# Path setup
full_path = os.path.realpath(__file__)
path, filename = os.path.split(full_path)

# JSON file for Thaddeus Luckstride
base_json_thaddeus = {
    "name": "Thaddeus Luckstride #1",
    "description": "MASTER OF LUCK - Thaddeus is a fortunate adventurer who always seems to find the best way out. He can avoid traps and exploit unexpected opportunities. Thaddeus was born with an extraordinary dose of luck, which has helped him in countless dangerous situations. This luck enables him to make wise choices and find valuable items at the most opportune moments.",
    "externalUri": "https://www.ageofchronos.com/",
    "external_url": "https://www.ageofchronos.com/",
    "mediaUri": "ipfs://Qmew4v1d8hamWcw2CkUGEijjBc6seCd2pAP1REYzuYAZRJ",
    "animation_url": "ipfs://Qmew4v1d8hamWcw2CkUGEijjBc6seCd2pAP1REYzuYAZRJ",
    "license": "PERSONAL LICENSE (\"CBE-PERSONAL\")",
    "licenseUri": "https://rmrk.app/license",
    "attributes": [
        {
            "label": "Attack",
            "type": "number",
            "value": "50",
            "trait_type": "Attack"
        },
        {
            "label": "Defence",
            "type": "number",
            "value": "5",
            "trait_type": "Defence"
        },
        {
            "label": "Magic",
            "type": "number",
            "value": "0",
            "trait_type": "Magic"
        },
        {
            "label": "Fortune",
            "type": "number",
            "value": "0",
            "trait_type": "Fortune"
        }
    ]
}

generate_json_files(base_json_thaddeus, 3, 1, 5, 2, 0, 60, 5, 'thaddeus')
