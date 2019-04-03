#https://www.briandunning.com/sample-data/
#https://github.com/woocommerce/woocommerce/blob/master/sample-data/sample_products.csv?fbclid=IwAR0ZzXaauPLkG-8GLwYt2p2dteZqYoCNL1mweGg_sT1eSR_C-jvn36KKLhQ

import csv
import string
from random import choice, randint, uniform, sample

individus = []
joueurs = []
with open("ca-500.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = -1
    for row in csv_reader:
        line_count+=1
        if line_count == 0:
            continue

        #https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits
        individus.append([line_count, row[1], row[0], ''.join(choice(string.ascii_uppercase + string.digits) for _ in range(10)), choice([row[9], row[0]+str(line_count)])])
        joueurs.append((line_count,))

gestionnaire = []
gestionnaire.append((choice(individus)[0],))

terrains = []
#https://stackoverflow.com/questions/7274267/print-all-day-dates-between-two-dates
from datetime import date, timedelta

d1 = date(2019, 4, 1)  # start date
d2 = date(2019, 8, 10)  # end date

delta = d2 - d1         # timedelta

for i in range(delta.days + 1):
    print(d1 + timedelta(i))
    for t_id in range(1, 6):
        terr = [t_id, d1+timedelta(i)]
        for heure in range(6, 21):
            terr.append(""+str(heure)+"_"+str(heure+1))
        terrains.append(terr)

#https://www.programiz.com/python-programming/working-csv-files
with open("./genned_csv/individu.csv", "w") as f:
    writer = csv.writer(f)
    writer.writerows(individus)

with open("./genned_csv/joueur.csv", "w") as f:
    writer = csv.writer(f)
    writer.writerows(joueurs)

with open("./genned_csv/gestionnaire.csv", "w") as f:
    writer = csv.writer(f)
    writer.writerows(gestionnaire)

with open("./genned_csv/terrain.csv", "w") as f:
    writer = csv.writer(f)
    writer.writerows(terrains)


