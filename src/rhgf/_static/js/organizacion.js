var org =
{
    path: "",

    init()
    {
        this.setAjustPanelUnidadEvent();

        contrato.list.init();
        unidad.list.init();
    },

    add(_view="")
    {
        let url_redir = (this.path) ? this.path + "_new/" : "./_new/";
        if (_view.trim() != "") url_redir += _view + "/";
        
        window.location.href = url_redir;
    },
    edt(id,_view="")
    {
        if ((typeof id === "number" && id <= 0) || (typeof id === "string" && id.trim() == "")) {
            console.error("Debe indicar un identificador válido");
            return;
        }

        let url_redir = (this.path) ? this.path + id.toString() + "/" : "./" + id.toString() + "/";
        if (_view.trim() != "") url_redir += _view + "/";

        window.location.href = url_redir;
    },
    del(id,callback=null,_view="")
    {
        if ((typeof id === "number" && id <= 0) || (typeof id === "string" && id.trim() == "")) {
            console.error("Debe indicar un identificador válido");
            return;
        }
        if (!confirm("¿Esta seguro que desea eliminar el registro seleccionado?")) return;
        
        let url = (this.path) ? this.path + id.toString() + "/" : "./" + id.toString() + "/";
        if (_view.trim() != "") url += _view + "/";

        InduxsoftCrudlModel.InvokeService(url,null,
            function(data){
                // if (data.message) { alert(data.message); return; }
                if (callback) callback(); else window.location.reload();
            },
            function(error){ console.error(error); },
            "DELETE",false,false
        );
    },

    toggleLeftPanel()
    {
        const tabUnidades = document.querySelector('#unidades_container');
        if (tabUnidades) tabUnidades.classList.toggle('hidde-unidad');
    },

    setAjustPanelUnidadEvent()
    {
        const line = document.querySelector('#ajust_panel_unidad');
        if (line)
        {
            let pageX, unidadPanel, unidadPanelWidth;
            
            line.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
            }
            line.onmousedown = (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                unidadPanel = e.target.parentElement;
                unidadPanel.style.transition = 'none';
                unidadPanel.classList.remove('hidde-unidad');
                pageX = e.pageX;
                unidadPanelWidth = unidadPanel.offsetWidth;
            }
            document.onmousemove = (e) => {
                e.stopPropagation();
                if (unidadPanel) {
                    let diffX = (e.pageX - pageX);
                    unidadPanel.style.width = (unidadPanelWidth + diffX)+'px';
                }
            }
            document.onmouseup = (e) => {
                e.stopPropagation();
                if (unidadPanel) unidadPanel.style.transition = '.5s';
                unidadPanel = undefined;
                pageX = undefined;
                unidadPanelWidth = undefined;
            }
        }
    },
}

var contrato =
{
    list: {
        tContratos: null, tEvents: {}, tData: {},

        init()
        {
            this.tContratos = document.getElementById("tbl_contratos");

            this.tContratos.hiddeSelector = true;
            this.tContratos.AutoAddRow = false;
            this.tContratos.AutoDelRow = false;

            this.tEvents = this.tContratos.EdiTable.Const.Events;
            this.tData = this.tContratos.DataArray;

            this.setEvents();
        },

        setEvents()
        {
            document.getElementById("btn_add").addEventListener("click", (event) => { org.add(); });
            document.getElementById("btn_edt").addEventListener("click", (event) => {
                let dt = this.tData[this.tContratos.CurrentRowIndex()];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la tabla."); return; }
                
                org.edt(dt.sys_pk);
            });
            document.getElementById("btn_del").addEventListener("click", (event) => {
                let currRow = this.tContratos.CurrentRowIndex();
                let dt = this.tData[currRow];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la tabla."); return; }
                
                empleado.del(dt.sys_pk,() => {
                    this.tContratos.DeleteRow(currRow);
                    this.tContratos._printRows();
                });
            });
        },
    }
}

var unidad =
{
    list: {
        tUnidades: null, tEvents: {}, tData: {},

        init()
        {
            this.tUnidades = document.getElementById("tbl_contratos");

            this.tUnidades.hiddeSelector = true;
            this.tUnidades.AutoAddRow = false;
            this.tUnidades.AutoDelRow = false;

            this.tEvents = this.tUnidades.EdiTable.Const.Events;
            this.tData = this.tUnidades.DataArray;

            this.setEvents();
        },

        setEvents()
        {
            document.getElementById("btn_add_unidad").addEventListener("click", (event) => { org.add("unidad"); });
            document.getElementById("btn_edt_unidad").addEventListener("click", (event) => {
                let dt = this.tData[this.tUnidades.CurrentRowIndex()];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la lista."); return; }
                
                org.edt(dt.sys_pk,"unidad");
            });
            document.getElementById("btn_del_unidad").addEventListener("click", (event) => {
                let currRow = this.tUnidades.CurrentRowIndex();
                let dt = this.tData[currRow];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la lista."); return; }
                
                empleado.del(dt.sys_pk,() => {
                    this.tContratos.DeleteRow(currRow);
                    this.tContratos._printRows();
                }, "unidad");
            });
        },
    }
}