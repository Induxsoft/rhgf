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
            InduxsoftCrudlModel.InvokeService("./?periodo="+pa.ref_rh_tipo_nomina?.value??0,null,
                function(data)
                {
                    var periodo=data?.periodo_anterior??null;
                    var pdata=true;
                    if(periodo==null)
                    {
                        var option=pa.ref_rh_tipo_nomina.options[pa.ref_rh_tipo_nomina.selectedIndex];
                        if(option)periodo=JSON.parse(option.getAttribute("data"));
                        pdata=false;
                    }
                    if(periodo==null)return;
                    
                    if(pdata)
                    {
                        
                    }
                    console.log(periodo)
                },
                function(error)
                {
                    alert(error.message ?? error);
                },"GET",false);
        });

        crud.trigger(pa.ref_rh_tipo_nomina,"change");
    }
}