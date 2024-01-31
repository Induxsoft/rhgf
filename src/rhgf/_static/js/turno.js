
document.addEventListener("DOMContentLoaded",()=>
{
    turno.init();
});

var turno=
{
    init()
    {
        turno.lunes=document.getElementById("lunes");
        turno.martes=document.getElementById("martes");
        turno.miercoles=document.getElementById("miercoles");
        turno.jueves=document.getElementById("jueves");
        turno.viernes=document.getElementById("viernes");
        turno.sabado=document.getElementById("sabado");
        turno.domingo=document.getElementById("domingo");

        turno.dv_lunes=document.querySelectorAll("#dv_lunes input");
        turno.dv_martes=document.querySelectorAll("#dv_martes input");
        turno.dv_miercoles=document.querySelectorAll("#dv_miercoles input");
        turno.dv_jueves=document.querySelectorAll("#dv_jueves input");
        turno.dv_viernes=document.querySelectorAll("#dv_viernes input");
        turno.dv_sabado=document.querySelectorAll("#dv_sabado input");
        turno.dv_domingo=document.querySelectorAll("#dv_domingo input");

        if(turno.lunes)turno.lunes.addEventListener("change",()=>{tools.$__enableFields(turno.dv_lunes,turno.lunes.checked)});
        if(turno.martes)turno.martes.addEventListener("change",()=>{tools.$__enableFields(turno.dv_martes,turno.martes.checked)});
        if(turno.miercoles)turno.miercoles.addEventListener("change",()=>{tools.$__enableFields(turno.dv_miercoles,turno.miercoles.checked)});
        if(turno.jueves)turno.jueves.addEventListener("change",()=>{tools.$__enableFields(turno.dv_jueves,turno.jueves.checked)});
        if(turno.viernes)turno.viernes.addEventListener("change",()=>{tools.$__enableFields(turno.dv_viernes,turno.viernes.checked)});
        if(turno.sabado)turno.sabado.addEventListener("change",()=>{tools.$__enableFields(turno.dv_sabado,turno.sabado.checked)});
        if(turno.domingo)turno.domingo.addEventListener("change",()=>{tools.$__enableFields(turno.dv_domingo,turno.domingo.checked)});

        // turno.dv_day_works=document.querySelectorAll("#dv_day_works input[type='checkbox']");

        crud.trigger(turno.lunes,"change");
        crud.trigger(turno.martes,"change");
        crud.trigger(turno.miercoles,"change");
        crud.trigger(turno.jueves,"change");
        crud.trigger(turno.viernes,"change");
        crud.trigger(turno.sabado,"change");
        crud.trigger(turno.domingo,"change");
    }
}