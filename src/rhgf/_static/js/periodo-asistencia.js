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

                    var option=pa.ref_rh_tipo_nomina.options[pa.ref_rh_tipo_nomina.selectedIndex];
                    var dataoption=null;
                    if(option)dataoption=JSON.parse(option.getAttribute("data"));

                    if(periodo==null){ pdata=false;}
                    
                    if(pdata)
                    {
                        if(pa.apertura && (periodo?.fapertura??"")!="" )pa.apertura.value=periodo.fapertura;
                        if(pa.inicio && (periodo?.finicio??"") )pa.inicio.value=periodo.finicio;
                        if(pa.cierre && (periodo?.fcierre??"") )pa.cierre.value=periodo.fcierre;
                        if(pa.fin && (periodo?.ffin??"") )pa.fin.value=periodo.ffin;

                    }
                    else
                    {
                        if(pa.apertura && (dataoption?.fapertura??"")!="" )pa.apertura.value=dataoption.fapertura;
                        // if(pa.inicio && (periodo?.finicio??"") )pa.inicio.value=periodo.finicio;
                        if(pa.cierre && (dataoption?.fcierre??"") )pa.cierre.value=dataoption.fcierre;
                        // if(pa.fin && (periodo?.ffin??"") )pa.fin.value=periodo.ffin;
                    }
                    
                },
                function(error)
                {
                    alert(error.message ?? error);
                },"GET",false);
        });

        crud.trigger(pa.ref_rh_tipo_nomina,"change");
    }
}