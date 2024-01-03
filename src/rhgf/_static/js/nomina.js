document.addEventListener("DOMContentLoaded",()=>
{
    nomina.init();
})

var nomina=
{
    init()
    {
        nomina.table_nomina=document.getElementById("lst_nominas");
        nomina.table_recibo=document.getElementById("lst_recibos");
        nomina.table_recibo_conceptos=document.getElementById("lst_recibos_conceptos");

        nomina.concepto=document.getElementById("concepto");
        nomina.importe=document.getElementById("importe");
        nomina.leyenda=document.getElementById("leyenda");

        nomina.btn_save_recibo_concepto=document.getElementById("btn_save_recibo_concepto");
    },
    Editar()
    {
        if(!nomina.table_nomina)return;

        var data_seleted=nomina.table_nomina.DataArray[nomina.table_nomina.CurrentRowIndex()];
        if(Number(data_seleted?.sys_pk??0)<1)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return
        }
        var url=nomina.url_nomina+data_seleted.sys_pk+"/";
       
        window.location.href=url;
    },
    Editar_Recibo()
    {
        var data_seleted=nomina.table_recibo.DataArray[nomina.table_recibo.CurrentRowIndex()];
        if(Number(data_seleted?.sys_pk??0)<1)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return
        }
        var url=nomina.url_recibo+data_seleted.sys_pk+"/";
        
        window.location.href=url;
    },
    add:false,url_recibo_concepto:"",
    Add(idrecibo=0)
    {
        if(nomina.concepto)nomina.concepto.setValue(null);
        if(nomina.importe)nomina.importe.value=0;
        if(nomina.leyenda)nomina.leyenda.value="";
        nomina.add=true;
        nomina.openModal("modal_concepto");
        if(nomina.btn_save_recibo_concepto)nomina.btn_save_recibo_concepto.setAttribute("onclick","nomina.ConceptoSave('"+nomina.url_add_concepto_recibo.replace("@recibo",idrecibo)+"')");
    },
    Editar_concepto()
    {
        if(!nomina.table_recibo_conceptos)
        {
            alert("Table indifinido");
            return;
        }
        if(nomina.table_recibo_conceptos.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }

        var data=nomina.table_recibo_conceptos.DataArray[nomina.table_recibo_conceptos.CurrentRowIndex()];
        data["descripcion"]=data.descripcion_concepto??"";
        data["codigo"]=data.codigo_concepto??"";
        
        console.log(data);
        nomina.concepto.setValue(data);

        var importe=data.importe??0;
        if(nomina.importe)nomina.importe.value=importe??0;
        if(nomina.leyenda)nomina.leyenda.value=data.leyenda??"";
        // if(data.percepcion>0)importe=data.percepcion;
        // else if(data.deduccion>0)importe=data.deduccion;
        // else if(data.obligacion>0)importe=data.obligacion;

        nomina.add=false;
        nomina.openModal("modal_concepto");
        if(nomina.btn_save_recibo_concepto)nomina.btn_save_recibo_concepto.setAttribute("onclick","nomina.ConceptoSave('"+nomina.url_concepto_recibo+data.sys_pk+"/"+"')");
        
    },
    ConceptoSave(url)
    {
        var concepto=nomina.concepto.getValue();
        if(!concepto)
        {
            alert("Debe seleccionar un concepto");
            return;
        }
        var data=
        {
            ref_concepto:concepto.ref_concepto??concepto.sys_pk,
            importe:Number(nomina.importe.value??0),
            leyenda:nomina.leyenda.value??""
        }
        
        InduxsoftCrudlModel.InvokeService(url,data,
        function(data)
        {
            window.location.reload();
        },
        function(error)
        {
            alert(error.message ?? error);
        },"POST",false);

    },
    DeleteReciboConcepto()
    {
        if(nomina.table_recibo_conceptos.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }

        var data=nomina.table_recibo_conceptos.DataArray[nomina.table_recibo_conceptos.CurrentRowIndex()];
        nomina.DeleteEntity(data.sys_pk,nomina.url_concepto_recibo);
    },
    DeleteNomina()
    {
        if(nomina.table_nomina.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }

        var data=nomina.table_nomina.DataArray[nomina.table_nomina.CurrentRowIndex()];
        nomina.DeleteEntity(data.sys_pk,nomina.url_nomina);
    },
    DeleteEntity(pk,url="./")
    {
        var res = confirm("¿Desea eliminar el elemento indicado?");
		if (!res) return;

		InduxsoftCrudlModel.InvokeService(url + pk + "/", null,
			function (data) 
            {
				window.location.reload();
			},
			function (error) {
				alert(error.message ?? error);
			}, "DELETE", false
		);
    },
    openModal(modalId='')
    {
        this.getBSModal(modalId).show();
    },
    closeModal(modalId='')
    {
        this.getBSModal(modalId).hide();
    },
    getBSModal(modalId='')
    {
        const modalElement = document.getElementById(modalId);

        if(!modalElement)
        {
            console.log("Elemento no definido");
            return;
        }
        const bsModal = bootstrap.Modal.getInstance(modalElement);
        if (!bsModal) return new bootstrap.Modal(modalElement);

        return bsModal;
    }

}