import requests
import random
import logging

formatter = logging.Formatter('%(message)s')


def setup_logger(name, log_file, level=logging.INFO):
    """To setup as many loggers as you want"""

    handler = logging.FileHandler(log_file)        
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)

    return logger

word_site = "https://www.mit.edu/~ecprice/wordlist.10000"
response = requests.get(word_site)
words = response.content.splitlines()

def WordGen(numOfWord):
    result = ' '.join([words[random.randint(0,len(words) - 1)].decode('utf-8').capitalize() for _ in range(numOfWord)])
    return result

sub_category = ['gods','creatures', 'items', 'notebook', 'novel', 'key_chain', 'backpack_wallet', 'necklace']
material = ['clay', 'metal', 'wood', 'glass', 'plastic']
origin = ['vietnam', 'america', 'china', 'england', 'italy', 'france', 'japan', 'india', 'brazil', 'argentina', 'canada']
class Product:
    def __init__(self):
        self.name = WordGen(5)
        self.imgSrc = '/image00{0}'.format(random.randint(1, 9))
        self.description = WordGen(30)
        self.price = round(random.random()*100, 2)
        self.category = sub_category[random.randint(0, 7)]
        self.material = material[random.randint(0, 4)]
        self.origin = origin[random.randint(0, 10)]
        self.discountId = random.randint(0, 20)
        self.inventory = random.randint(50, 200)
        self.quantitySold = random.randint(1, 600)

listOfProduct = [];
for _ in range(50):
    product = Product()
    listOfProduct.append(product)
def ProductGen(num):
    template = "('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}', '{9}', NOW())"
    result = ', '.join([template.format(listOfProduct[i].name, listOfProduct[i].imgSrc, listOfProduct[i].description, listOfProduct[i].price, listOfProduct[i].category, listOfProduct[i].material, listOfProduct[i].origin, listOfProduct[i].discountId, listOfProduct[i].inventory, listOfProduct[i].quantitySold) for i in range(num)])
    return result

def DiscountGen(num):
    template = "('{0}', '{1}', NOW())"
    result = ', '.join([template.format(WordGen(2), random.randint(25, 70)) for _ in range(num)])
    return result

productData = setup_logger("product", "product.txt")
productData.info(ProductGen(len(listOfProduct)))
discountData = setup_logger("discount", "discount.txt")
discountData.info(DiscountGen(20))
