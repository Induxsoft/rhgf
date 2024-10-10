document.addEventListener("DOMContentLoaded",()=>{ae.init();});

var ae=
{
    init()
    {
        this.txt_file=document.getElementById("txt_file");
        this.check_importar=document.getElementById("check_importar");
        this.sel_periodo=document.getElementById("sel_periodo");
        this.div_check=document.getElementById("div_check");
        this.div_importar=document.getElementById("div_importar");

        if(this.check_importar)this.check_importar.addEventListener("change",
        ()=>
        {
            if(this.check_importar.checked)this.sel_periodo.disabled=false;
            else this.sel_periodo.disabled=true;
        });

        if(!asistencia.file)asistencia.file=this.txt_file;
    },
    showmodal(idact="")
    {
        if(this.txt_file)this.txt_file.value="";
        if(this.check_importar)this.check_importar.checked=true;
        tools.trigger(this.check_importar,"change");

        if(idact=="01")
        {
            if(this.div_check)this.div_check.classList.add("d-none");
            if(this.div_importar)this.div_importar.classList.add("d-none");
            this.check_importar.checked=true;
            asistencia.url_taskman=ae.url_taskman.replace("{taskname}",ae.program_gen_asist);
            asistencia.omit_file=true;
        }
        else
        {
            if(this.div_check)this.div_check.classList.remove("d-none");
            if(this.div_importar)this.div_importar.classList.remove("d-none");
            asistencia.url_taskman=ae.url_taskman.replace("{taskname}",ae.program_acceso);
            asistencia.omit_file=false;
        }
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