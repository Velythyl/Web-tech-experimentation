#https://www.briandunning.com/sample-data/

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

d1 = date(2019, 2, 1)  # start date
d2 = date(2019, 4, 16)  # end date

delta = d2 - d1         # timedelta

for i in range(delta.days + 1):
    print(d1 + timedelta(i))
    r_dates.append(d1+timedelta(i))

for date in sample(r_dates, 75):

    player_set = set()
    heure_set = set()
    for i in range(choice([1, 2, 3, 4, 5, 7, 10])):

        player = choice(joueurs)[0]
        while player in player_set:
            player = choice(joueurs)[0]
        player_set.add(player)

        heure = choice([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
        while heure in heure_set:
            heure = choice([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
        heure_set.add(heure)

        reservations.append([choice([1, 2, 3, 4, 5]), date, heure, player])

terrain = []
for i in range(5):
    terrain.append((i+1,))

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

with open("./genned_csv/terrain.csv", "w", newline='') as f:
    writer = csv.writer(f, lineterminator='\n')
    writer.writerows(terrain)



