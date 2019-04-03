#https://www.briandunning.com/sample-data/
#https://github.com/woocommerce/woocommerce/blob/master/sample-data/sample_products.csv?fbclid=IwAR0ZzXaauPLkG-8GLwYt2p2dteZqYoCNL1mweGg_sT1eSR_C-jvn36KKLhQ

import csv
from random import choice, randint, uniform, sample

min_y = 2014
min_m = 1
min_j = 1
def reset():
    global min_y, min_m, min_j

    min_y = 2014
    min_m = 1
    min_j = 1

def rand_date():
    global min_y, min_m, min_j

    min_y = randint(min_y,2019)
    min_m = randint(min_m,12)
    min_j = randint(min_j,28)

    return str(min_y) + "-" +str(min_m) + "-"+ str(min_j)

individus = []

with open("forGenner/ca-500.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = -1
    for row in csv_reader:
        line_count+=1
        if line_count == 0:
            continue

        individus.append([line_count, row[9], str(hash(row[9])), row[0]+str(randint(1, 1000)), row[7], row[3]+row[4]+row[5]+" "+row[6]])

def cat_ex(cat):
    temp = []
    for exp in experts:
        if exp[1]==cat: temp.append(exp)

    return temp
#https://www.ibm.com/communities/analytics/watson-analytics-blog/sales-products-sample-data/

items = []
categories = set()
par_enf = set()
offres = []
evals = []
props = []
experts = []
with open("forGenner/ibm_csv.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = -1
    for row in sample(list(csv_reader), 10000):
        line_count+=1
        if line_count == 0:
            continue

        print(line_count)

        statut_int = randint(-1, 2)
        statut = ""
        if statut_int==-1: statut="Evince"
        elif statut_int==0: statut="Attente"
        elif statut_int==1: statut="Affiche"
        elif statut_int==2: statut="Vendu"

        item = [line_count, 1+int(float(row[8])/float(row[9])), row[5], row[3] + row[4] + row[5] + row[6], row[9], randint(0, 10), row[3], statut]

        items.append(item)

        experts.append([choice(individus)[0], item[6]])

        categories.add((row[2],))
        categories.add((row[3],))
        categories.add((row[4],))

        par_enf.add((row[2], row[3]))
        par_enf.add((row[3], row[4]))

        afficheur_id = choice(individus)[0]

        if (statut_int >= 0):
            props.append([line_count, afficheur_id, item[0], rand_date()])

        if statut_int >= 1:
            evals.append([line_count, choice(cat_ex(item[6]))[0],1+ int(uniform(0, item[1])), rand_date(), item[0], rand_date()])

        if (statut_int >= 2):
            offres.append(
                [line_count, choice(individus)[0], afficheur_id, item[0], 1+int(uniform(0, item[1] + 100)), rand_date(), rand_date()])

        reset()

with open("forGenner/categorieFinal.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = -1
    for row in csv_reader:
        line_count+=1
        if line_count == 0:
            continue

        categories.add((row[0],))

#https://www.programiz.com/python-programming/working-csv-files
with open("./genned_csv/categories.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerows(categories)

with open("./genned_csv/individus.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerows(individus)

with open("./genned_csv/items.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerows(items)

with open("./genned_csv/experts.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerows(experts)

with open("./genned_csv/offres.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerows(offres)

with open("./genned_csv/evaluations.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerows(evals)

with open("./genned_csv/propositions.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerows(props)

with open("./genned_csv/par_enf.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerows(par_enf)
