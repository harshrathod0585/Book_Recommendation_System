from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import random

app = Flask(__name__)
CORS(app)

books = pickle.load(open('book.csv', 'rb'))
similarity = pickle.load(open('book-similarity.pkl', 'rb'))
cbr = pickle.load(open('cbr.csv', 'rb'))

@app.route('/userid', methods=['GET'])
def user_id():
    random_choice = random.choice(cbr.index)
    print(random_choice)
    return jsonify({'user_id': int(random_choice)})

@app.route('/recommend/<int:userid>', methods=['GET'])
def recommend(userid):
    user_index = np.where(cbr.index == userid)[0][0]
    recommended_book = []
    user_list = sorted(
        list(enumerate(similarity[user_index])),
        key=lambda x: x[1],
        reverse=True
    )[1:11]
    for i in user_list:
        data = books[books['User-ID'] == cbr.index[i[0]]]
        for j in range(min(5, len(data))):
            book_data = {
                'Book-Title': data['Book-Title'].iloc[j],
                'Book-Author': data['Book-Author'].iloc[j],
                'Book-image': data['Image-URL-S'].iloc[j],
            }
            recommended_book.append(book_data)
    return jsonify(recommended_book)

if __name__ == '__main__':
    app.run(debug=True)
