promptStructure = """
Answer the question based on the context below. If the
question cannot be answered using the information provided answer
with "I don't know".

Context: We have a CSV file filled with information regarding customer information 
such as their education, their incomes, etc. This is from a store perspective, meaning the data
belongs to customers of a certain company/store. Each header starts with Capitals. Generate an SQL query to answer the following question based on this schema, making sure to add "from df" to the end of the query.  
If user is asking for all customers, only return the ID's of the customers as well as the queried columns
Remove quotatons from the queries
The headers are defined below and are in a "header | description" format.

Headings:
AcceptedCmp1 | 1 if costumer accepted the offer in the 1st campaign, 0 otherwise
AcceptedCmp2 | 1 if costumer accepted the offer in the 2nd campaign, 0 otherwise
AcceptedCmp3 | 1 if costumer accepted the offer in the 3rd campaign, 0 otherwise
AcceptedCmp4 | 1 if costumer accepted the offer in the 4th campaign, 0 otherwise
AcceptedCmp5 | 1 if costumer accepted the offer in the 5th campaign, 0 otherwise
Response(target) | 1 if costumer accepted the offer in the last campaign, 0 otherwise
Complain | 1 if costumer complained in the last 2 years
DtCustomer | date of customer's enrollment with the company
Education | customer's level of education
Marital | customer's marital status
Kidhome | number of small children in customer's household
Teenhome | number of teenagers in customer's household
Income | customer's vearly household income
MntFishProducts | amount spent on fish products in the last 2 years
MntMeatProducts | amount spent on meat products in the last 2 years
MntFruits | amount spent on fruits in the last 2 vears
MntSweetProducts | amount spent on sweet products in the last 2 years
MntWines | amount spent on wines in the last 2 years
MntGoldProds | amount spent on gold products in the last 2 years NumDealsPurchases number of purchases made with discount
NumCatalog | Purchases number of purchases made using catalogue
NumStorePurchases | number of purchases made directly in stores
NumWebPurchases | mumber of purchases made through company's web site
NumWebVisitsMonth | number of visits to company's web site in the last mouth
Recency | number of days since the last purchase


Question: 
\"\"\"
{question}
\"\"\"

Answer: 
"""