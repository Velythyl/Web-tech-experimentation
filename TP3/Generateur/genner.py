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

reservations = []
#https://stackoverflow.com/questions/7274267/print-all-day-dates-between-two-dates
from datetime import date, timedelta

r_dates = []

d1 = date(2018, 4, 1)  # start date
d2 = date(2019, 4, 1)  # end date

delta = d2 - d1         # timedelta

for i in range(delta.days + 1):
    print(d1 + timedelta(i))
    r_dates.append(d1+timedelta(i))

for date in sample(r_dates, 75):
    reservations.append([choice([1, 2, 3, 4, 5]), date, choice([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), choice(joueurs)[0]])

#https://www.programiz.com/python-programming/working-csv-files
with open("./genned_csv/individu.csv", "w", newline='') as f:
    writer = csv.writer(f, lineterminator='\n')
    writer.writerows(individus)

with open("./genned_csv/joueur.csv", "w", newline='') as f:
    writer = csv.writer(f, lineterminator='\n')
    writer.writerows(joueurs)

with open("./genned_csv/gestionnaire.csv", "w", newline='') as f:
    writer = csv.writer(f, lineterminator='\n')
    writer.writerows(gestionnaire)

with open("./genned_csv/reservation.csv", "w", newline='') as f:
    writer = csv.writer(f, lineterminator='\n')
    writer.writerows(reservations)


