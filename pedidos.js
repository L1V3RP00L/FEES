/*const apiURL = 'https://liverpool4-dev.mirakl.net/api/orders?order_state_codes=SHIPPING&&withIncidents=FALSE&withReturns=FALSE&sort=dateCreated&order=desc&paginate=false';
// Si la API precisa autenticacion, podemos usar usuario y clave
const headers = {
  "Authorization": "5266f9e2-c8a2-4c33-9f96-073fb2d8b7d6",
  "Accept": "application/json"
}; */

//const apiURL = 'https://liverpool-prod.mirakl.net/api/orders?order_ids=3760019311-A';
/*const headers = {
  "Authorization": "f45a7011-3427-4948-8082-e04fdedcd48a",
  "Accept": "application/json"
};*/
//const apiURL = 'https://liverpool-prod.mirakl.net/api/orders?order_state_codes=SHIPPING&withIncidents=FALSE&withReturns=FALSE&sort=dateCreated&offset=8000&order=desc&max=9000'
const apiURL = 'https://liverpool-prod.mirakl.net/api/orders?start_update_date=2023-11-28T00:00:00&end_update_date=2023-11-29T24:00:00&order_state_codes=SHIPPING&withIncidents=FALSE&withReturns=FALSE&sort=dateCreated&order=desc&paginate=false'
//const apiURL = 'https://liverpool-prod.mirakl.net/api/orders?order_state_codes=SHIPPING&withIncidents=FALSE&withReturns=FALSE&sort=dateCreated&order=desc&paginate=false';
//const apiURL = 'https://liverpool-prod.mirakl.net/mmp/operator/order/search?&dateFrom=2023-11-26&dateTo=2023-11-26T23%3A59%3A59%2C999&orderStateGroup=SHIPPING&withIncidents=FALSE&withRefunds=FALSE&sort=dateCreated&order=desc';

const headers = {
  "Authorization": "b4785bab-30a0-41d0-8e51-6f07c701b4dd",
  "Accept": "application/json"
}

const params = {
  "method":"GET",
  "headers":headers

};
  //const pedidoConfiguracion = ["-"];
  //const PedidoSinGuiaS0 = ["-"];
  var PedidoSinGuia;
  let hi;
  let hf;
  let diferenciaEnMinutos;
  
  

function sinGuia(){
try {

  fetch(apiURL, params)
  .then(res => res.json())
  .then(data => {
    //console.log(data);
    
    if (data && Object.keys(data).length > 0) {
      
      // Los datos contienen información
       //console.log(data.orders[0].order_additional_fields);
      console.log(data.total_count);
      console.log(data.status);
      data.orders.forEach(element => {  
       // console.log("Paso 1")
       //console.log("elemento "+element.order_state);
      
       //console.log("pedido  "+element.order_id+" fecha aceptacion "+data.orders[0].acceptance_decision_date+ " fecha actualizacion "+data.orders[0].last_updated_date[1]); 
       //console.log("pedido  "+element.order_id+" fecha actualizacion "+data.orders[0].last_updated_date.replace("T", ' ').replace("Z", '')+ " fecha actualizacion order_lines "+data.orders[0].order_lines[0].last_updated_date.replace("T", ' ').replace("Z", '')); 
     

       if (element.has_incident == false && element.fully_refunded == false ){
         // validar si es un SL
        // console.log("Paso 2")
        // si tiene shipping_tracking_url validar si tiene documento siempre y cuando sea una tienda valida
        
        if(element.shipping_tracking_url == null){
          
          element.order_lines.forEach(valor =>{           
            // CICLO PARA VALIDAR SI ES UN SL O BT
            valor.order_line_additional_fields.forEach(sku =>{
              //console.log("Paso 3.9 "+sku.code+" "+sku.value.toLowerCase())
              
              if(sku.code == "tipo-articulo" && sku.value.toLowerCase() == "Soft Line" || sku.value.toUpperCase().trim() == "SOFTLINE" || sku.value.toUpperCase() == "SL" || sku.value.toUpperCase() == "MKPSL"|| sku.value.toUpperCase() == "soft line"){
                // CICLO PARA VALIDAR EL PORQUE NO SE GENERA LA GUIA

               //tiempo(element.order_id)
               
               /*if(element.shipping_tracking_url == null && element.order_state == "SHIPPING"){
                console.log(element.order_id + " "+ element.order_state)
                //console.log(element.order_id," "+element.shop_id)
                PedidoSinGuia = element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+",Error del Job no ha tomado el pedido,"+element.shop_id
                guiasExter(element.shop_id,PedidoSinGuia);
                }*/
                

                element.order_additional_fields.forEach(medidas =>{                 

                  

                  if (medidas.code =="broker-label-creation-info" && medidas.value == "true" ){
                      if (medidas.code =="broker-shipping-label-info" && medidas.value == ""){
                        PedidoSinGuia = element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+",Error del sistema,"+element.shop_id
                        guiasExter(element.shop_id,PedidoSinGuia);
                      }
                  }
                  
                  if (medidas.code =="broker-shipping-label-info" && medidas.value.includes('Tipo_respuesta: ERR Respuesta: Error. Ningún 3PL logró generar la guía.')){
                      PedidoSinGuia = element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+",Tipo_respuesta: ERR Respuesta: Error. Ningún 3PL logró generar la guía,"+element.shop_id
                      guiasExter(element.shop_id,PedidoSinGuia);
                   }
     
                  if(medidas.code =="broker-shipping-label-info" && medidas.value.includes('Tipo_respuesta: ERR Respuesta: No existe configuración para los datos proporcionados')){
                    
                    PedidoSinGuia = element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+",Tipo_respuesta: ERR Respuesta: No existe configuración para los datos proporcionados,"+element.shop_id
                    guiasExter(element.shop_id,PedidoSinGuia);
                  }                   
                  
                  if(medidas.code =="broker-shipping-label-info" && medidas.value.includes('Inicia proceso ATG - Broker - Gestor')){
                    // llamar al proceso en el cual me indique si es seller con guias internas o externas
                    PedidoSinGuia = element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+",Inicia proceso ATG - Broker - Gestor,"+element.shop_id
                    guiasExter(element.shop_id,PedidoSinGuia);
                    
                  }

                  if(medidas.code =="broker-shipping-label-info" && medidas.value.includes('{"message":"Envío de mensaje exitoso","id_peticion":"{')){
                    // llamar al proceso en el cual me indique si es seller con guias internas o externas
                    PedidoSinGuia = element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+",Inicia proceso ATG - Broker - Gestor,"+element.shop_id
                    guiasExter(element.shop_id,PedidoSinGuia);
                    
                  }
              
                  
                })


                

              }else{
                //console.log("Los datos corresponden a un BT");
              }
              
            })
          })
       }
       }
     });// fin data.orders.forEach
    } else {
      // Los datos están vacíos o no son un objeto válido
      console.log("Los datos están vacíos o no son válidos:", data);
    }

 }).catch(err => console.log("Sin conexión a internet "+err));
  }

  catch (e) {
  console.log("Hola error",e);
  return ["Error:", e];
}
}

function guiasExter(tienda,error){
  //console.log("Datos "+tienda)
  var apiGuiasExte = 'https://liverpool-prod.mirakl.net/api/shops?shop_ids='+tienda;
  
  
  try {

    fetch(apiGuiasExte, params)
    .then(res => res.json())
    .then(data => {
      if (data && Object.keys(data).length > 0) {
      
        // Contiene la informacion de la tienda
        data.shops.forEach(element => {  
          // realiza una busqueda entre la informacion de la tienda
            element.shop_additional_fields.forEach(guia => {
            // si encuentra el codigo conf-external-delivery-guides
            if(guia.code =="conf-external-delivery-guides" &&  guia.value == "false"){              
              console.log(error);
            }
           })
        });
      }
    }).catch(err => console.log("guiasExter "+err));
  } catch (e) {
    //console.log(e);
    return ["Error:", e];
  }

}



class TimeSpan{
  constructor(milisegundos){
    this.Value=milisegundos;
    for (const def of TimeSpan.definiciones) {
      this[def.key] = this.Value  / def.factor;
    }
  }
  
  toString()
  {
     let res = [];
     let value = this.Value;
     for (const def of TimeSpan.definiciones) {
        if(this[def.key] <1 || value==0)  continue;
        let intPart =  Math.floor(value / def.factor);
        
        value = value - (intPart * def.factor);
        let nombre = intPart == 1 ? def.nombre.substring(0, def.nombre.length - 1) : def.nombre;
        res.push(`${intPart} ${nombre}`);
         
      }
      
        return res.join(", ");
  }
  valueOf(){
    return this.value;
  }
  static FromMiliseconds(ms){
    return new TimeSpan(ms);
  }
  static FromSeconds(s){
    return new TimeSpan(s * 1000);
  }
  
   static definiciones = [
      //{key: 'TotalYears', factor: 60 * 60 * 24 * 365 * 1000, nombre: "Años" },
      //{key: 'TotalDays', factor: 60 * 60 * 24 * 1000, nombre: "Días" },
      //{key: 'TotalHours', factor: 60 * 60 * 1000, nombre: "Horas" },
      {key: 'TotalMinutes', factor: 60 * 1000, nombre: "" },
      //{key: 'TotalSeconds', factor: 1 * 1000, nombre: "Segundos" }
    ]; 

}


function tiempo(pedido){
  var apiPedido = 'https://liverpool-prod.mirakl.net/api/orders?order_ids='+pedido;  
  
  try {

    fetch(apiPedido, params)
    .then(res => res.json())
    .then(data => {
      if (data && Object.keys(data).length > 0) {
      
        // Contiene la informacion de la tienda
        data.orders.forEach(element => {  
          // realiza una busqueda entre la informacion de la tienda
          let H1 = element.last_updated_date.replace("T", ' ').replace("Z", '')
          let H2 = element.order_lines[0].last_updated_date.replace("T", ' ').replace("Z", '')
          
           hi = new Date(H1);
           hf = new Date(H2);
           //let ts = new TimeSpan(hi-hf);

           let date = TimeSpan.FromMiliseconds(hi-hf);
           console.log("H1 "+hi," H2 "+hf+" ",parseInt(date));
          
           //console.log(parseInt(date.toString())+" "+pedido)
           

           //si el pedido tiene un tiempo mayor a 1 hora debera de mandarse como error del sistema
           //if(parseInt(date.toString()) > 60){
            //console.log("pedid con mayor tiempo "+pedido+" "+date.toString())
            //PedidoSinGuia = element.acceptance_decision_date.replace("-", '/').replace("-", '/').replace("T", ' ').replace("Z", '')+","+element.order_id+","+element.shop_name+",Error del job no detecto el pedido ,"+element.shop_id
            
            // validar si tiene documento ,pero no url
           // guiasExter(element.shop_id,PedidoSinGuia);            

           //}else{
            //console.log("Tiempo "+date.toString())

           //}

            
        });
      }
    }).catch(err => console.log("TiempoEx "+err));
  } catch (e) {
    //console.log(e);
    return ["Error:", e];
  }

}



sinGuia();
//tiempo("0630015754-A");
//guiasExter("3235","error")


