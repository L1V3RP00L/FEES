/*const apiURL = 'https://liverpool4-dev.mirakl.net/api/orders?order_state_codes=SHIPPING&&withIncidents=FALSE&withReturns=FALSE&sort=dateCreated&order=desc&paginate=false';
// Si la API precisa autenticacion, podemos usar usuario y clave
const headers = {
  "Authorization": "5266f9e2-c8a2-4c33-9f96-073fb2d8b7d6",
  "Accept": "application/json"
}; 

const apiURL = 'https://liverpool-prod.mirakl.net/api/orders?order_state_codes=SHIPPING&withIncidents=FALSE&withReturns=FALSE&sort=dateCreated&order=desc&paginate=false';
const headers = {
  "Authorization": "f45a7011-3427-4948-8082-e04fdedcd48a",
  "Accept": "application/json"
};*/

const apiURL = 'https://liverpool-prod.mirakl.net/api/orders?order_state_codes=SHIPPING&withIncidents=FALSE&withReturns=FALSE&sort=dateCreated&offset=0&order=desc&max=100';
const headers = {
  "Authorization": "f45a7011-3427-4948-8082-e04fdedcd48a",
  "Accept": "application/json"
}

const params = {
  "method":"GET",
  "headers":headers

};
  const pedidoConfiguracion = ["-"];
  const PedidoSinGuiaS0 = ["-"];
  const PedidoSinGuia = ["-"];


try {

  fetch(apiURL, params)
  .then(res => res.json())
  .then(data => {
  
    
    if (data && Object.keys(data).length > 0) {
      
      // Los datos contienen información
       //console.log(data.orders[0].order_additional_fields);
      //console.log(data.total_count);
      data.orders.forEach(element => {  
       // console.log("Paso 1")
       //console.log("elemento "+element.order_state); 
       //console.log("elemento "+data.orders[0].order_additional_fields); 
       
       if (element.has_incident == false && element.fully_refunded == false ){
         // validar si es un SL
        // console.log("Paso 2")
      
         if(element.shipping_tracking_url == null){
          //console.log("Paso 3- "+element.order_id + " "+element.order_lines)
       
          //console.log("elemento "+element.order_lines[1].can_refund)
          element.order_lines.forEach(valor =>{
           
            // CICLO PARA VALIDAR SI ES UN SL O BT

            valor.order_line_additional_fields.forEach(sku =>{
              //console.log("Paso 3.9 "+sku.code+" "+sku.value.toLowerCase())
              
              if(sku.code == "tipo-articulo" && sku.value.toLowerCase() == "soft line" || sku.value.toUpperCase().trim() == "SOFTLINE" || sku.value.toUpperCase() == "SL"){
                //console.log("Paso 4")
                //console.log("orde-id "+ element.order_id +"tipo-articulo SL")
                // CICLO PARA VALIDAR EL PORQUE NO SE GENERA LA GUIA               


                element.order_additional_fields.forEach(medidas =>{
                  
                  if (medidas.code =="broker-shipping-label-info" && medidas.value.includes('Tipo_respuesta: ERR Respuesta: Error. Ningún 3PL logró generar la guía.')){
                    //console.log("Paso 5.1")
                    //console.log("Pedido sin guia "+ element.order_id)
                    console.log(element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+",Tipo_respuesta: ERR Respuesta: Error. Ningún 3PL logró generar la guía.")
                    PedidoSinGuia.push(element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+","+element.shop_id);

                  }

                  if(medidas.code =="broker-shipping-label-info" && medidas.value.includes('Tipo_respuesta: ERR Respuesta: No existe configuración para los datos proporcionados')){
                    console.log(element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+",Tipo_respuesta: ERR Respuesta: No existe configuración para los datos proporcionados")
                    pedidoConfiguracion.push(element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+","+element.shop_id);

                  }                   
                  
                  if(medidas.code =="broker-shipping-label-info" && medidas.value.includes('Inicia proceso ATG - Broker - Gestor')){
                    //console.log("Paso 5.3")
                    //console.log("Pedido sin guia "+ element.order_id)
                    console.log(element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+",Inicia proceso ATG - Broker - Gestor")                    
                    PedidoSinGuiaS0.push(element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+","+element.shop_id);
                    //console.log("Pedido sin guia con atributo de Numero de guias 0 "+ element.order_id)
                  }
                })

              }
              //console.log(codigo)
            })

            //console.log(valor.order_line_additional_fields[0])
          })
       }
      
 
       }
     });// fin data.orders.forEach
    } else {
      // Los datos están vacíos o no son un objeto válido
      console.log("Los datos están vacíos o no son válidos:", data);
    }

// eliminar posibles pedidos repetidos
    /*let resultSinGuia = PedidoSinGuia.filter((item,index)=>{
      return PedidoSinGuia.indexOf(item) === index;
    })
    console.log("Pedido sin guia");
    console.log(resultSinGuia); //[1,2,6,5,9,'33']


    let resultSinGuiaCero = PedidoSinGuiaS0.filter((item,index)=>{
      return PedidoSinGuiaS0.indexOf(item) === index;
    })
    console.log("Pedido con guia cero ");
    console.log(resultSinGuiaCero); //[1,2,6,5,9,'33']

    let resultpedidoConfiguracion = pedidoConfiguracion.filter((item,index)=>{
      return pedidoConfiguracion.indexOf(item) === index;
    })
    console.log("Pedido sin configuracion");
    console.log(resultpedidoConfiguracion);*/ //[1,2,6,5,9,'33']
  
   
 });
}

catch (e) {
  console.log(e);
  return ["Error:", e];
}

