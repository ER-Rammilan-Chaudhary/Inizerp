// const students = [
//     {
//         name: "Rahul",
//         age: 20,
//         marks: 85
//     },
//     {
//         name: "Sneha",
//         age: 22,
//         marks: 75
//     },
//     {
//         name: "Neha",
//         age: 19,
//         marks: 91
//     }
// ];

// function getStudentInfo(students, searchName) {
//     const filter = students.filter((student) => {
//         return student.marks >= 60 &&
//             student.name.toLowerCase().includes(searchName.toLowerCase());

//     })
//     // console.log(filter);
//     const names = filter.slice(0, 2).map((student, i) => {
//         return student.name
//     })
//     return names
// }

// const data = getStudentInfo(students, 's')
// console.log(data)


const products = [
    { name: "Laptop", price: 50000 },
    { name: "Phone", price: 30000 },
    { name: "Mouse", price: 1000 },
    { name: "Keyboard", price: 2000 },
];

// Saare products print karo.
// Sirf product names print karo.
// ₹10,000 se expensive products filter karo.
// Sabhi products ki total price nikalo.
// Sabse expensive product find karo.

function gertProductList(products, searchProduct) {
    // const productList = products.map((product) => {
    //     return product
    // })
    // return productList;

    // const expensive = products.filter((product) => {
    //     return product.price >= 10000
    // })

    // const total = products.reduce((a, b) => {
    //     return a+b.price
    // },0)
    // return total

    // let expensivePrice = 0
    // const productList = products.map((product) => {
    //     return product
    // })
    // return productList;


    const expensiveProduct = products.reduce((max, product) => {
        return product.price > max.price ? product : max;
    });

    return expensiveProduct
    // console.log(expensiveProduct);

}

const productss = gertProductList(products)
console.log(productss);


