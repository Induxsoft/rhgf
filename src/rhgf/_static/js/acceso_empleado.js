document.addEventListener("DOMContentLoaded",()=>{ae.init();});

var ae=
{
    init()
    {
        this.txt_file=document.getElementById("txt_file");
        this.check_importar=document.getElementById("check_importar");
        this.sel_periodo=document.getElementById("sel_periodo");

        if(this.check_importar)this.check_importar.addEventListener("change",
        ()=>
        {
            if(this.check_importar.checked)this.sel_periodo.disabled=false;
            else this.sel_periodo.disabled=true;
        });

        if(!asistencia.file)asistencia.file=this.txt_file;
    },
    showmodal()
    {
        if(this.txt_file)this.txt_file.value="";
        if(this.check_importar)this.check_importar.checked=true;
        tools.trigger(this.check_importar,"change");
        nomina.openModal("modal_acceso");
    },
    iniciarJob()
    {
        if(!this.sel_periodo)console.warn("Elemento no encontrado.");

        if(this.check_importar.checked && (Number(this.sel_periodo.value) || 0)<1 )
        {
            alert("Debe seleccionar un periodo");
            return;
        }

        if(!this.check_importar.checked)asistencia.periodo=0;
        else asistencia.periodo=(Number(this.sel_periodo.value) || 0);

        asistencia.ProgramFile();

        nomina.closeModal("modal_acceso");
    }
}