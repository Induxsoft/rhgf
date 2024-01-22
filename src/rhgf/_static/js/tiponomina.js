
document.addEventListener("DOMContentLoaded",()=>
{
    tn.init();
});
var tn=
{
    init()
    {
        tn.ref_rh_frec_periodo=document.getElementById("ref_rh_frec_periodo");
        tn.final1=document.getElementById("final1");
        tn.final2=document.getElementById("final2");
        tn.final3=document.getElementById("final3");

        tn.lbl_final1=document.getElementById("lbl_final1");
        tn.lbl_final2=document.getElementById("lbl_final2");
        tn.lbl_final3=document.getElementById("lbl_final3");

        tn.div_1=document.getElementById("div_1");
        tn.div_2=document.getElementById("div_2");
        tn.div_3=document.getElementById("div_3");

        tn.inicio=document.getElementById("div_inicio");
        tn.dias_cierre=document.getElementById("div_dias_cierre");

        var htmlfinal1=tn.final1.innerHTML??"";
        if(tn.ref_rh_frec_periodo)tn.ref_rh_frec_periodo.addEventListener("change",()=>
        {
            var option=tn.ref_rh_frec_periodo.options[tn.ref_rh_frec_periodo.selectedIndex];
            if(!option)return;
            var data=JSON.parse(option.getAttribute("data"));
            
            if(tn.lbl_final1)tn.lbl_final1.innerHTML="Fin del primer periodo del mes:";
            if(tn.div_1) tn.div_1.style.cssText="display:none";
            if(tn.div_2) tn.div_2.style.cssText="display:none";
            if(tn.div_3) tn.div_3.style.cssText="display:none";
            if(tn.inicio)tn.inicio.style.cssText="display:block";
            if(tn.dias_cierre)tn.dias_cierre.style.cssText="display:block";

            if(tn.final1)tn.final1.innerHTML=htmlfinal1;
            switch(data.dias??0)
            {
                case 7:
                    if(tn.div_1) tn.div_1.style.cssText="display:block";
                    if(tn.final1)tn.final1.innerHTML=tn.semanas;
                    if(tn.lbl_final1)tn.lbl_final1.innerHTML="Finaliza el dia:";
                    break; //semanal
                case 10:
                    if(tn.div_1) tn.div_1.style.cssText="display:block";
                    if(tn.div_2) tn.div_2.style.cssText="display:block";
                    if(tn.div_3) tn.div_3.style.cssText="display:block";
                    break; //decenal
                case 14://catorcenal
                    if(tn.div_1) tn.div_1.style.cssText="display:block";
                    if(tn.final1)tn.final1.innerHTML=tn.semanas;
                    if(tn.lbl_final1)tn.lbl_final1.innerHTML="Finaliza el dia:";
                    break;
                case 15:
                    if(tn.div_1) tn.div_1.style.cssText="display:block";
                    if(tn.div_2) tn.div_2.style.cssText="display:block";
                    break;//quincenal
                case 30://mensual
                case 60:
                    if(tn.div_1) tn.div_1.style.cssText="display:block";
                    if(tn.lbl_final1)tn.lbl_final1.innerHTML="Día del mes:";
                    break;//bimestral
                default:
                    if(tn.inicio)tn.inicio.style.cssText="display:none";
                    if(tn.dias_cierre)tn.dias_cierre.style.cssText="display:none";
                    break
                
            }
        });

        crud.trigger(tn.ref_rh_frec_periodo,"change");
    },
    validate()
    {
        if(Number(tn.final1.value)>=Number(tn.final2.value))
        {
            alert("El primer período no puede ser mayor al segundo");
            return false;
        }
        // if( Number(tn.final1.value)>Number(tn.final3.value))
        if(Number(tn.final2.value)>=Number(tn.final3.value))
        {
            alert("El segundo período no puede ser mayor al tercer período");
            return false;
        }
        return true;
    }
}