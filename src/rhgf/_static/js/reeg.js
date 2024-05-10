document.addEventListener("DOMContentLoaded",
()=>
{
    reeg.init();
});

var reeg=
{
    init()
    {   
        this.rechazar=document.getElementById("rechazar");
        this.aprobar=document.getElementById("aprobar");
        this.cancelar=document.getElementById("cancelar");
        this.pagar=document.getElementById("pagar");
        this.form_reeg=document.getElementById("form_reeg");
        this.table_hoja=document.getElementById("table_hoja");
        this.importe_aprobado=document.getElementById("importe_aprobado");

        if(this.rechazar)this.rechazar.addEventListener("click",()=>{reeg.changeStatus(reeg.reeg_rechazar)})
        if(this.aprobar)this.aprobar.addEventListener("click",()=>{reeg.aprobarImporte()})
        if(this.cancelar)this.cancelar.addEventListener("click",()=>{reeg.changeStatus(reeg.reeg_cancelar)})
        // if(this.pagar)this.pagar.addEventListener("click",(reeg.changeStatus(reeg.reeg_rechazar))=>{})

            InduxsoftNumberFields.Init();
    },
    validate()
    {
        var json=JSON.stringify(this.table_hoja.DataArray);
        var input=reeg.createElement("input",{type:"hidden",value:json,name:"hoja"});
        this.form_reeg.append(input);
        
        return true;
    },
    DelRow()
    {
        this.table_hoja.DeleteCurrentRow();
    },
    AddRow()
    {
        this.table_hoja.AddRow();
    },
    aprobarImporte()
    {
        
        if(Number(this.importe_aprobado.value)<1)
        {
            alert("El importe aprobado debe ser mayor a 0");
            return;
        }
        try 
        {
            this.changeStatus(reeg.reeg_aprobar);
        } catch (error) 
        {
            alert("Ocurrió un error: Debe colocar solo números");
        }
        
    },
    changeStatus(status,aprobar=false)
    {
        if(!this.form_reeg)return;
        var input=reeg.createElement("input",{type:"hidden",value:status,name:"status"});
        this.form_reeg.append(input);
        this.form_reeg.submit();
    },
    createElement(tagName="div", attributes={})
    {
        const elem = document.createElement(tagName);
        const keys = Object.keys(attributes);
        keys.forEach(key => elem.setAttribute(key, attributes[key]));
        return elem;
    }
}