const containerElement = document.querySelector('.container');
const loadingElement = document.querySelector('.loading')

// store last document
let latestDoc = null;


const getNextReviews = async () => {
    loadingElement.classList.add('active');

    const outfitsRef = db.collection('outfits')
        .orderBy('title')
        .startAfter(latestDoc)
        .limit(4);

    const piecesRef = db.collection('pieces');

    const piecesQuery = await piecesRef.where(firebase.firestore.FieldPath.documentId(), 'in', ["B0821F2RLQ","B0778WBDGQ"]);



    const outfitDocs = await outfitsRef.get();
    const pieceDocs = await piecesQuery.get();
    console.log(pieceDocs.docs.length)
    console.log(outfitDocs.docs.length)
    pieceDocs.docs.forEach(pieceDoc => {
        const pieceData = pieceDoc.data()
        console.log(pieceData.id);
        console.log(pieceData);
    });


    // output docs
    let template = '';

    outfitDocs.docs.forEach(doc => {




        const outfit = doc.data();
        template += `<div class="card">`;
        template += `<h2>${outfit.title}</h2>`;
        template += `<ul>`;
        outfit.pieces.forEach(piece => {
            template += `<li>${piece}</li>`;
        })
        template += `</ul>`;
        template += `</div>`;
        latestDoc = doc;
    });

    containerElement.innerHTML += template;
    loadingElement.classList.remove('active');

    if (outfitDocs.empty) {
        loadMoreButton.removeEventListener("click", handleClick);
        containerElement.removeEventListener('scroll', handleScroll);
    }

}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// wait for DOM content to load
window.addEventListener('DOMContentLoaded', () => getNextReviews());

const loadMoreButton = document.querySelector(".load-more button");

const handleClick = () => {
    getNextReviews();
}

loadMoreButton.addEventListener("click", handleClick);

// load more docs (scroll)

const handleScroll = () => {
    let triggerHeight = containerElement.scrollTop + containerElement.offsetHeight;
    if (triggerHeight >= containerElement.scrollHeight) {
        getNextReviews();
    }
}


containerElement.addEventListener('scroll', handleScroll)