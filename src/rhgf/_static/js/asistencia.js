document.addEventListener("DOMContentLoaded",()=>
{
    asis.init();
});

var asis=
{
    init()
    {
        asis.inasistencia=document.getElementById("inasistencia");
        asis.justificacion=document.getElementById("justificacion");
        asis.ref_rh_periodo_asistencia=document.getElementById("ref_rh_periodo_asistencia");
        asis.ref_contrato=document.getElementById("ref_contrato");
        asis.ref_turno=document.getElementById("ref_turno");
        asis.entrada=document.getElementById("entrada");

        if(asis.ref_contrato)asis.ref_contrato.addEventListener("change",()=>
        {
            crud.trigger(asis.inasistencia,"change");
        });
        if(asis.ref_turno)asis.ref_turno.addEventListener("change",()=>
        {
            crud.trigger(asis.inasistencia,"change");
        });
        if(asis.entrada)asis.entrada.addEventListener("change",()=>
        {
            crud.trigger(asis.inasistencia,"change");
        });
        if(asis.inasistencia)asis.inasistencia.addEventListener("change",()=>
        {
            if(asis.inasistencia.checked)
            {
                asis.justificacion.innerHTML="";
                asis.justificacion.removeAttribute("disabled");
                
                var c=asis.ref_contrato.getValue();
                var t=asis.ref_turno.getValue();

                var url=`../_new/?pkcontrato=${c?.sys_pk??""}&entrada=${asis.entrada?.value??""}&pkturno=${t?.sys_pk??""}&periodo=${asis.ref_rh_periodo_asistencia?.value??""}`;

                InduxsoftCrudlModel.InvokeService(url,null,
                (data)=>
                {
                    var html="";
                    for (let i = 0; i < data.justificaciones.length; i++) {
                        var j = data.justificaciones[i];
                        var selected=j.sys_pk==asis.pkjustificacion?"selected='true'":"";
                        html+=`<option value="${j.sys_pk}" ${selected}>${j.codigo+" - "+j.descripcion+" "+j.finicio+" - "+j.ffin}</option>`;
                    }
                    if(asis.justificacion)asis.justificacion.innerHTML=html;
                },
                (error)=>
                {
                    alert(error.message??error);
                },"GET",false);
            }
            else
            {
                if(asis.justificacion)
                {
                    asis.justificacion.innerHTML="";
                    asis.justificacion.setAttribute("disabled","true");
                }
            }
        });
    }
}