//const baseUrl = 'http://localhost:1337';
const baseUrl = 'https://reparateurs.onrender.com';
function fillTable(data) {
    const tableBody = document.getElementById('apiTableBody');
  
    // Vide le contenu actuel du tableau pour éviter la duplication des données
    tableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.attributes.login}</td>
            <td>${item.attributes.nom}</td>
            <td>${item.attributes.prenom}</td>
            <td>${item.attributes.raisonsociale}</td>
            <td>${item.attributes.codePrestataire}</td>
            <td>${item.attributes.telephone}</td>
            <td>${item.attributes.email}</td>
            <td>${item.attributes.wilaya.data.attributes.nomWilaya}</td>
            <td>${item.attributes.commune_reparateur.data?item.attributes.commune_reparateur.data.attributes.nomCommune:''}</td>
            <td>${item.attributes.adresseDuGarage}</td>
            <td>${item.attributes.NIF}</td>
            <td>${item.attributes.RIB}</td>
            <td>${item.attributes.dureeMaximalReponse}</td>
            <td>${item.attributes.NumeroRegistreComerce}</td>
            <td>${item.attributes.regimeFiscal}</td>
            <td>${item.attributes.Ristourne}</td>
            <td>${item.attributes.Taux}</td>
            <td>${item.attributes.modeDePaiement}</td>
            <td>${item.attributes.Etat}</td>
            <td> <div class = "div-actions"><button class = "btn-supprimer" title="Supprimer" onclick="supprimerReparateur('${item.id}')">X</button> <button class= "btn-editer" title="Éditer" onclick="editereparateur('${item.id}')">&#9998;</button> <button class = "btn-password" title="Reset password" onclick="ressetPassword('${item.id}')">&#128273;</button> </div> </td> <!-- Bouton Supprimer -->
            <!-- Ajoutez d'autres colonnes selon vos besoins -->
        `;
        tableBody.appendChild(row);
    });
  }
  
  
  //remplir Wilaya
  async function findAllWilayas(){
      const apiUrl = `${baseUrl}/api/wilayas/`;
  
  try {
      
  const response = await fetch(apiUrl);
  
  const jsonResponse = await response.json();
  
  const data = jsonResponse.data;
  
  return data;
  } catch (err) {
      
  }
  
  
  }
  
  async function remplirListWilaya() {
      // Get the select element
      const selectElement = document.getElementById("wilayas");
      
      // Check if selectElement has options already
      if (selectElement.options.length === 0) {
          const dynamicChoices = await findAllWilayas();
         
          // Loop through the array of dynamic choices
          dynamicChoices.forEach(choice => {
              // Create an option element for each choice
              const option = document.createElement("option");
              // Set the value and text content of the option
              const { id, attributes: { codeWilaya } } = choice;
              const value = { id, codeWilaya };
              option.value = JSON.stringify(value);
              console.log("JSON.stringify(value)",JSON.stringify(value));
              //option.value = value;
              option.textContent = choice.attributes.nomWilaya;
              // Append the option to the select element
             
              
              selectElement.appendChild(option);
              
            
          });
      }
  }
  
  // Call remplirListWilaya initially
  remplirListWilaya();
  
  // Change event listener to "click"
  document.getElementById("wilayas").addEventListener("click", remplirListWilaya);
  
  
  
  
  async function getCommune() {
      try {
          const response = await fetch(`${baseUrl}/API/commune-reparateurs/?populate=*`);
          if (!response.ok) {
              throw new Error('La requête a échoué');
          }
          const jsonResponse = await response.json();
  
          const data = jsonResponse.data;
         
  
          return data; // Retourner les données si nécessaire
      } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
      }
  }


  async function getCommunesByWilaya(codeWilaya) {
    const url = `${baseUrl}/API/communesByWilayas/${codeWilaya}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('La requête a échoué');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
}

async function filtreCommunes(codeWilaya) {
    const selectElementC = document.getElementById("communnes");
    selectElementC.innerHTML = ""; // Clear previous options

    try {
        const communesFiltrer = await getCommunesByWilaya(codeWilaya);
        communesFiltrer.forEach(choice => {
            const option = document.createElement("option");
            option.value = choice.id;
            option.textContent = choice.nomCommune;
            selectElementC.appendChild(option);
        });
    } catch (error) {
        // Handle error if necessary
    }
}

  
  // Call filtreCommunes with the initially selected wilaya code
  
  (async function() {
      await remplirListWilaya();
  
      // Get the select element
      const selectElement = document.getElementById("wilayas");
      console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",selectElement.value);
      const value = JSON.parse(selectElement.value);
      const selectedWilayaCode = value.codeWilaya;
      filtreCommunes(selectedWilayaCode);
  })();
  
  
  
      document.getElementById("wilayas").addEventListener("change", async function() {
          const selectElement = document.getElementById("wilayas");
          const value = JSON.parse(selectElement.value);
          const selectedWilayaCode = value.codeWilaya;
          await filtreCommunes(selectedWilayaCode);
      });
  
  
  
  
  //filtrer les reaparateurs
  async function afficherReparateursFiltrer(filterValue) {
      const apiUrl = `${baseUrl}/API/Reparateurs?filters[codePrestataire][$contains]=${filterValue}&populate=*`;
  
      try {
          // Appel de l'API avec fetch
          const response = await fetch(apiUrl);
          
          // Vérifier si la réponse est OK (code 200)
          if (!response.ok) {
              throw new Error('Erreur lors de la récupération des données');
          }
  
          // Convertir la réponse en JSON
          const dataResponse = await response.json();
          const data = dataResponse.data;
          fillTable(data);
      } catch (error) {
          // Gérer les erreurs
          console.error('Erreur:', error);
      }
  }
  
   async  function afficherReparateurs() {
  try {
      const response = await fetch(`${baseUrl}/API/Reparateurs/?populate=*`);
     
      if (!response.ok) {
          throw new Error('La requête a échoué');
      }
     const jsonResponse = await response.json();
     const data = jsonResponse.data;
     console.log("<<<<<<<<<<<<<<<<<<<<<<<<",data);
     fillTable(data);
  
  } catch (error) {
      console.log("error",error)
  }
  
    }
  
  
  
  
       // Gestionnaire d'événement pour le clic sur le bouton
       document.getElementById('filterButton').addEventListener('click', function() {
          const filterValue = document.getElementById('codePrestataireFiltrer').value;
         
          afficherReparateursFiltrer(filterValue);
      });
  
      document.getElementById('codePrestataireFiltrer').addEventListener('keyup', function(event) {
          const filterValueKeyUp = this.value.trim(); // ou event.target.value.trim();
          afficherReparateursFiltrer(filterValueKeyUp);
        });
  
  
  
   async function ajouterReparateur() {
      const selectElement = document.getElementById("wilayas");
          const value = JSON.parse(selectElement.value);
          const idWilaya = value.id;
    let formData = {
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("preNom").value,
        adresseDuGarage: document.getElementById("adresseGarage").value,
        raisonsociale: document.getElementById("raisonsociale").value,
        codePrestataire: document.getElementById("codePrestataire").value,
        telephone: document.getElementById("telephone").value,
        email: document.getElementById("email").value,
        wilaya:{connect: [idWilaya]},
        commune_reparateur: {connect: [document.getElementById("communnes").value]},
        NIF: document.getElementById("NIF").value,
        RIB: document.getElementById("RIB").value,
        dureeMaximalReponse: document.getElementById("dureeMaximalReponse").value,
        NumeroRegistreComerce: document.getElementById("NumeroRegistreComerce").value,
        regimeFiscal: document.getElementById("regimeFiscal").value,
        Ristourne: document.getElementById("Ristourne").value,
        Taux: document.getElementById("Taux").value,
        modeDePaiement: document.getElementById("modeDePaiement").value,
        Etat: document.getElementById("Etat").value
    };
  
   try {

   
        const response = await fetch(`${baseUrl}/API/Reparateurs`, {
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json',
              //   'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ data: formData })
        });
   
 
    
      if (!response.ok) {
        const errorData = await response.json(); // Récupérer les données d'erreur de la réponse
        const errorMessage = errorData.error.message; // Récupérer le message d'erreur
        alert(errorMessage); // Afficher le message d'erreur dans une alerte
        throw new Error(errorMessage);
      
      }
    const dataResponse = await  response.json();
    const {login,password} = dataResponse.data.attributes;
    afficherReparateurs();
    alert("un nouveau reparateur à été ajouté avec login: "+login+"et password : "+password);
    console.log("reparateur ajouté : ",dataResponse);
    
   } catch (error) {
   
   }
  
  }
  
  
  
  // Fonction pour supprimer un réparateur
  function supprimerReparateur(id) {
      fetch(`${baseUrl}/API/Reparateurs/${id}`, {
          method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        
          // Réafficher la liste des réparateurs après suppression
          afficherReparateurs();
      })
      .catch(error => {
          console.error('Erreur lors de la suppression du réparateur:', error);
      });
    }
  

  
  
  // Appeler afficherReparateurs lors du chargement initial de la page
  document.addEventListener('DOMContentLoaded', afficherReparateurs);
  
  const toggleBtn = document.getElementById('toggleBtn');
      const panel = document.getElementById('panel');
  
      toggleBtn.addEventListener('click', function() {
          panel.classList.toggle('active');
          if (panel.classList.contains('active')) {
              toggleBtn.textContent = 'Fermer le Panneau';
          } else {
              toggleBtn.textContent = 'Ajoutez un réparateur';
          }
      });
  
      
      const toggleBtnFiltre = document.getElementById('toggleBtnFiltre');
      const filterForm = document.getElementById('filterForm');
  
      toggleBtnFiltre.addEventListener('click', function() {
          filterForm.classList.toggle('active');
          if (filterForm.classList.contains('active')) {
              toggleBtnFiltre.textContent = 'Fermer le Panneau';
          } else {
              toggleBtnFiltre.textContent = 'Ajoutez un Filtre';
          }
      });
  
  



  async function ressetPassword(id) {
    const apiUrl = `${baseUrl}/API/Reparateurs/${id}?populate[0]=users_permissions_user`;
  
    try {
        // Appel de l'API avec fetch
        const response = await fetch(apiUrl);
        
        // Vérifier si la réponse est OK (code 200)
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        // Convertir la réponse en JSON
        const dataResponse = await response.json();
        const data = dataResponse.data;

        const newWindow = window.open('', 'EditForm', 'width=400,height=300');
        newWindow.document.write(`
          <html>
          <head>
            <title>Editer</title>
          </head>
          <body>
            <h2>Editer</h2>
            <form id="editForm">
              <label for="emailEdited">Email:</label><br>
              <input type="text" id="emailEdited" name="emailEdited" readonly value="${data.attributes.email}"><br>
              <label for="newPassword">Password:</label><br>
              <input type="text" id="newPassword" name="newPassword" value=""><br><br>
              <input type="submit" value="Enregistrer">
            </form>
          </body>
          </html>
        `);
    
        // Add an event listener for the form submission in the new window
        newWindow.document.getElementById('editForm').addEventListener('submit', async function(event) {
          event.preventDefault(); // Prevent page reload
          const newPassword = newWindow.document.getElementById('newPassword').value;
          let formData = {
            password: newPassword
          }
  const idd = data.attributes.users_permissions_user.data.id;
  
          const response = await fetch(`${baseUrl}/API/changePassword/${idd}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) {
            console.log("errrrrrro");
          
          }
        const dataResponse = await  response.json();
      
        console.log(dataResponse);
          newWindow.close();
        });

       
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur:', error);
    }
  }
  


  async function editereparateur(id) {
    const apiUrl = `${baseUrl}/API/Reparateurs/${id}?populate=*`;
  
    try {
        // Appel de l'API avec fetch
        const response = await fetch(apiUrl);
        
        // Vérifier si la réponse est OK (code 200)
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        // Convertir la réponse en JSON
        const dataResponse = await response.json();
        const data = dataResponse.data;
        const {attributes} = data;
     
        const { id:idWilaya, attributes: { codeWilaya } } = data.attributes.wilaya.data;
        const value = { idWilaya, codeWilaya };
    
        const newWindow = window.open('', 'EditRepa');
        newWindow.document.write(`
          <html>
          <head>
            <title>Editer</title>
            <link rel="stylesheet" href="styles.css">
          </head>
          <body>
            <h2>Editer</h2>
            <div class="form-container">
            <form id="editForm">
            <div class = "mainForm">
            <div>
            <label for="nom">Nom:</label><br>
            <input type="text" id="nom" name="nom" value="${attributes.nom}"><br>
            <label for="prenom">Prénom:</label><br>
            <input type="text" id="prenom" name="prenom" value="${attributes.prenom}"><br>
            <label for="raisonsociale">Raison Sociale:</label><br>
            <input type="text" id="raisonsociale" name="raisonsociale" value="${attributes.raisonsociale}"><br>
            <label for="codePrestataire">Code Prestataire:</label><br>
            <input type="text" id="codePrestataire" name="codePrestataire" value="${attributes.codePrestataire}"><br>
            <label for="telephone">Téléphone:</label><br>
            <input type="text" id="telephone" name="telephone" value="${attributes.telephone}"><br>
            
            </div>
      
            <div>
            <label for="wilayas"  name="wilayas" >Wilaya :</label><br>
            <select id="wilayas" ></select><br>
            <label for="communnes">Communes :</label><br>
            <select id="communnes" name="communnes" ></select><br>
            <label for="email">Email:</label><br>
            <input type="text" id="email" name="email" value="${attributes.email}"><br>
            <label for="adresseGarage">Adresse Garage:</label><br>
            <input type="text" id="adresseGarage" name="adresseGarage" value="${attributes.adresseDuGarage}"><br>
            </div>


            <div> 
           
            <label for="NIF">NIF:</label><br>
            <input type="text" id="NIF" name="NIF" value="${attributes.NIF}"><br>
            <label for="RIB">RIB:</label><br>
            <input type="text" id="RIB" name="RIB" value="${attributes.RIB}"><br>
            <label for="dureeMaximalReponse">Durée Maximale Réponse:</label><br>
            <input type="text" id="dureeMaximalReponse" name="dureeMaximalReponse" value="${attributes.dureeMaximalReponse}"><br>
            <label for="NumeroRegistreCommerce">Numéro Registre Commerce:</label><br>
            <input type="text" id="NumeroRegistreCommerce" name="NumeroRegistreCommerce" value="${attributes.NumeroRegistreComerce}"><br>
            <label for="regimeFiscal">Régime Fiscal:</label><br>
            <input type="text" id="regimeFiscal" name="regimeFiscal" value="${attributes.regimeFiscal}"><br>
            </div>
        
            <div>
            <label for="ristourne">Ristourne:</label><br>
      <select id="ristourne" name="ristourne" value="${attributes.Ristourne}" required><br>
        <option value="Oui" ${attributes.Ristourne === 'Oui' ? 'selected' : ''}>Oui</option>
        <option value="Non"  ${attributes.Ristourne === 'Non' ? 'selected' : ''}>Non</option>
      </select><br>
            <label for="taux">Taux:</label><br>
            <input type="text" id="taux" name="taux" value="${attributes.Taux}"><br>
            <label for="modeDePaiement">Mode de Paiement:</label><br>
            <input type="text" id="modeDePaiement" name="modeDePaiement" value="${attributes.modeDePaiement}"><br>
            <label for="etat">État:</label>
            <select id="etat" name="etat" required>
              <option value="Active" ${attributes.Etat === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${attributes.Etat === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select><br><br></div>
            </div>
          
            </div>
            <div class="div-btn">
            <input type="submit" id="editerReparateurBtn" class ="btn-add btn-edited" value="Enregistrer">
            </div>
          </form>
          </div>
          </body>
          </html>
        `);
        

        let selectElement = newWindow.document.getElementById("wilayas");
      
        // Check if selectElement has options already
        if (selectElement.options.length === 0) {
            const dynamicChoices = await findAllWilayas();
           
            // Loop through the array of dynamic choices
            dynamicChoices.forEach(choice => {
                // Create an option element for each choice
                const option = document.createElement("option");
                // Set the value and text content of the option
                const { id, attributes: { codeWilaya } } = choice;
                const value = { id, codeWilaya };
                option.value = JSON.stringify(value);
             
                //option.value = value;
                option.textContent = choice.attributes.nomWilaya;
                // Append the option to the select element
          

                selectElement.appendChild(option);
                
              
            });
        }

        
    //Sélectionner la wilaya actuelle
    const wilayaActuelle = data.attributes.wilaya.data;
    console.log(wilayaActuelle.attributes.codeWilaya);  
    for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        const optionValue = JSON.parse(option.value);
        if (optionValue.id === wilayaActuelle.id) {
            option.selected = true;
            break;
        }
    }


   



    const codewilayaActuelle = wilayaActuelle.attributes.codeWilaya;
    let selectElementC = newWindow.document.getElementById("communnes");
    selectElementC.innerHTML = ""; // Clear previous options

    try {
        const communesFiltrer = await getCommunesByWilaya(codewilayaActuelle);
        console.log("<<<<",communesFiltrer);
        communesFiltrer.forEach(choice => {
            const option = document.createElement("option");
            option.value = choice.id;
            option.textContent = choice.nomCommune;
            selectElementC.appendChild(option);
        });
    } catch (error) {
        // Handle error if necessary
    }

    const communeActuelle = data.attributes.commune_reparateur.data;
    console.log("communeActuelle",communeActuelle);
    
    for (let i = 0; i < selectElementC.options.length; i++) {
        const option = selectElementC.options[i];
        const optionValue = option.value;
        console.log(optionValue);
        if (optionValue == communeActuelle.id) {
            
            option.selected = true;
            break;
        }
    }



    selectElement.addEventListener('change', async function(event) {
        // Récupérer la valeur de la wilaya sélectionnée
        const selectedWilayaId = JSON.parse(selectElement.value).codeWilaya;
console.log(selectElement.value);

        const selectElementC = newWindow.document.getElementById("communnes");
        // Effacer les options actuelles de la liste déroulante des communes
        selectElementC.innerHTML = "";
    
        try {
            // Récupérer les communes par wilaya sélectionnée
            const communesFiltrer = await getCommunesByWilaya(selectedWilayaId);
            
            // Parcourir les communes filtrées et ajouter chaque option à la liste déroulante des communes
            communesFiltrer.forEach(choice => {
                const option = document.createElement("option");
                option.value = choice.id;
                option.textContent = choice.nomCommune;
                selectElementC.appendChild(option);
            });
        } catch (error) {
            // Gérer l'erreur si nécessaire
            console.error("Erreur lors de la récupération des communes:", error);
        }
    });


        newWindow.document.getElementById('editForm').addEventListener('submit', async function(event) {
          event.preventDefault(); // Prevent page reload
        
          const nom = newWindow.document.getElementById("nom").value;
          const prenom = newWindow.document.getElementById("prenom").value;
          const raisonsociale = newWindow.document.getElementById("raisonsociale").value;
          const codePrestataire = newWindow.document.getElementById("codePrestataire").value;
          const telephone = newWindow.document.getElementById("telephone").value;
          const email = newWindow.document.getElementById("email").value;
          const wilayas = newWindow.document.getElementById("wilayas").value;
          const communnes = newWindow.document.getElementById("communnes").value;
          const adresseGarage = newWindow.document.getElementById("adresseGarage").value;
          const NIF = newWindow.document.getElementById("NIF").value;
          const RIB = newWindow.document.getElementById("RIB").value;
          const dureeMaximalReponse = newWindow.document.getElementById("dureeMaximalReponse").value;
          const NumeroRegistreCommerce = newWindow.document.getElementById("NumeroRegistreCommerce").value;
          const regimeFiscal = newWindow.document.getElementById("regimeFiscal").value;
          const ristourne = newWindow.document.getElementById("ristourne").value;
          const taux = newWindow.document.getElementById("taux").value;
          const modeDePaiement = newWindow.document.getElementById("modeDePaiement").value;
          const etat = newWindow.document.getElementById("etat").value;
      
          const selectedWilayaId = JSON.parse(selectElement.value).id;
          console.log(selectElement.value);
          console.log(selectedWilayaId);


          let formData = {
              nom: nom,
              prenom: prenom,
              raisonsociale: raisonsociale,
              codePrestataire: codePrestataire,
              telephone: telephone,
              email: email,
              wilaya: { connect: [selectedWilayaId] },
              commune_reparateur: { connect: [communnes] },
              adresseDuGarage: adresseGarage,
              NIF: NIF,
              RIB: RIB,
              dureeMaximalReponse: dureeMaximalReponse,
              NumeroRegistreCommerce: NumeroRegistreCommerce,
              regimeFiscal: regimeFiscal,
              Ristourne: ristourne,
              taux: taux,
              modeDePaiement: modeDePaiement,
              Etat: etat
          };
          
          
          const response = await fetch(`${baseUrl}/API/Reparateurs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: formData })
        });
        if (!response.ok) {
            console.log("errrrrrro");
          
          }
        const dataResponse = await  response.json();
      
        console.log(dataResponse);
        afficherReparateurs();
          newWindow.close();
          
        });

       
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur:', error);
    }
  }
  
  