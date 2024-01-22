document.addEventListener("DOMContentLoaded",()=>
{
    pa.init();
});

var pa=
{
    init()
    {
        pa.ref_rh_tipo_nomina=document.getElementById("ref_rh_tipo_nomina");
        pa.apertura=document.getElementById("apertura");
        pa.cierre=document.getElementById("cierre");
        pa.inicio=document.getElementById("inicio");
        pa.fin=document.getElementById("fin");

        if(pa.ref_rh_tipo_nomina)pa.ref_rh_tipo_nomina.addEventListener("change",(e)=>
        {
            var data=pa.ref_rh_tipo_nomina.getValue();
            if(!data)return;

            if(data.finicio && pa.apertura)pa.apertura.value=data.finicio;
            
        });
    }
}