const fs = require('fs');

// const user = {
//     id: 1,
//     name: 'John Doe',
//     age: 22
//   }
  
//   // convert JSON object to a string
//   const data = JSON.stringify(user)
  
//   // write JSON string to a file
//   fs.writeFile('user.json', data, err => {
//     if (err) {
//       throw err
//     }
//     console.log('JSON data is saved.')
//   })

fs.readFile('champion_en.json', 'utf-8', (err, data) => {
    if (err) {
      throw err
    }
  
    // parse JSON object
    const eng = JSON.parse(data.toString())
  
    fs.readFile('champion_ua.json', 'utf-8', (err, data) => {
        if (err) {
          throw err
        }
      
        // parse JSON object
        const ua = JSON.parse(data.toString())

        let newData = ua;

        Object.values(eng.data).forEach(({ id, image }) => {
            newData = {
                ...newData,
                data: {
                    ...newData.data,
                    [id]: {
                        ...newData.data[id],
                        id,
                        image
                    }
                }
            }
        })

        
        // convert JSON object to a string
        const jsonNewData = JSON.stringify(newData)
        
        // write JSON string to a file
        fs.writeFile('champions.json', jsonNewData, err => {
            if (err) {
            throw err
            }
            console.log('JSON data is saved.')
        })
      
        
      })
    
  })