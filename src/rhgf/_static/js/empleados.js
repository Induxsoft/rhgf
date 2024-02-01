var empleado =
{
    tableId: "", path: "", table: null,

    init()
    {
        if (this.tableId.trim() != "") { this.table = document.getElementById(this.tableId); }
    },

    trigger(element,event) {
        if (element) {
            let e = new Event(event);
            element.dispatchEvent(e);
        }
    },

    round(num, dec=2) {
        var signo = (num >= 0 ? 1 : -1);
        num = num * signo;
        if (dec === 0) return signo * Math.round(num);
        num = num.toString().split('e');
        num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + dec) : dec)));
        num = num.toString().split('e');
        return signo * (num[0] + 'e' + (num[1] ? (+num[1] - dec) : -dec));
    },

    goTo(url) {
        if (!url) { alert("No se ha indicado un destino."); return; }
        if (!this.table) { alert("No se encontro una definición de tabla (edit-table)."); return; }
        if (this.table.CurrentRowIndex() < 0) { alert("Debe seleccionar una fila"); return; }

        var data = this.table.DataArray[this.table.CurrentRowIndex()];
        window.location.href = url.replace("@empleado",data.sys_pk);
    },

    add()
    {
        let url_redir = (this.path) ? this.path + "_new/" : "./_new/"
        window.location.href = url_redir;
    },
    edt(id)
    {
        if ((typeof id === "number" && id <= 0) || (typeof id === "string" && id.trim() == "")) {
            console.error("Debe indicar un identificador válido");
            return;
        }

        let url_redir = (this.path) ? this.path + id.toString() + "/" : "./" + id.toString() + "/";
        window.location.href = url_redir;
    },
    del(id,callback=null)
    {
        if ((typeof id === "number" && id <= 0) || (typeof id === "string" && id.trim() == "")) {
            console.error("Debe indicar un identificador válido");
            return;
        }
        if (!confirm("¿Esta seguro que desea eliminar el registro seleccionado?")) return;
        
        let url = (this.path) ? this.path + id.toString() + "/" : "./" + id.toString() + "/";
        InduxsoftCrudlModel.InvokeService(url,null,
            function(data){
                // if (data.message) { alert(data.message); return; }
                if (callback) callback(); else window.location.reload();
            },
            function(error){ console.error(error); },
            "DELETE",false,false
        );
    },

    list: {
        tEmpleados: null,
        tEvents: {},
        tData: {},
        txt_search_empleado: null,
        btn_search_empleado: null,

        init()
        {
            this.tEmpleados = document.getElementById("tbl_empleados");
            this.txt_search_empleado = document.getElementById("txt_search_empleado");
            this.btn_search_empleado = document.getElementById("btn_search_empleado");

            this.tEmpleados.hiddeSelector = true;
            this.tEmpleados.AutoAddRow = false;
            this.tEmpleados.AutoDelRow = false;

            this.tEvents = this.tEmpleados.EdiTable.Const.Events;
            this.tData = this.tEmpleados.DataArray;

            this.setEvents();
            this.setKeyboardShortcuts();
        },

        setEvents()
        {
            document.getElementById("btn_add").addEventListener("click", (event) => { empleado.add(); });
            document.getElementById("btn_edt").addEventListener("click", (event) => {
                let dt = this.tData[this.tEmpleados.CurrentRowIndex()];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la tabla."); return; }
                
                empleado.edt(dt.sys_pk);
            });
            document.getElementById("btn_del").addEventListener("click", (event) => {
                let currRow = this.tEmpleados.CurrentRowIndex();
                let dt = this.tData[currRow];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la tabla."); return; }
                
                empleado.del(dt.sys_pk,() => {
                    this.tEmpleados.DeleteRow(currRow);
                    this.tEmpleados._printRows();
                });
            });

            if (this.txt_search_empleado) {
                this.txt_search_empleado.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.buscarEmpleado();
                });
            }
            if (this.btn_search_empleado) {
                this.btn_search_empleado.addEventListener("click", () => { this.buscarEmpleado(); });
            }
        },

        setKeyboardShortcuts()
        {
            document.addEventListener("keydown", (e) => {
                // console.log("key: "+ e.key + " | " + "code: " + e.code);
                if (e.key === "Escape") {
                    e.preventDefault();
                    window.open("/","_top");
                }
            });
        },

        buscarEmpleado() {
            let text = this.txt_search_empleado.value.trim();
            let url = this.txt_search_empleado.getAttribute("data-url-search").trim();
            // if (!text) return;
            if (!url) { alert("No se indico un destino"); return; }
            if (!this.tEmpleados) { alert("No se ha definido la tabla de proveedores."); return; }
            url = url.replace("@search",text);
            
            let onSuccess = (data) => {
                if (data.message) { alert(data.message); return;}
                let div_spnmsg = document.getElementById("div_spnmsg");

                if (Object.entries(data).length == 0) {
                    div_spnmsg.querySelector("#spnmsg").textContent = "No se encontraron resultados.";
                    div_spnmsg.classList.remove("d-none");
                } else {
                    div_spnmsg.querySelector("#spnmsg").textContent = "";
                    div_spnmsg.classList.add("d-none");
                }
                
                this.tData = data;
                this.tEmpleados.DataArray = data;
                this.tEmpleados._printRows();
            }
            let onFailure = (error) => {
                alert('No se pudo realizar la busqueda.\n' + JSON.stringify(error));
            }
    
            InduxsoftCrudlModel.InvokeService(url,null,onSuccess,onFailure,"GET",false);
        }
    },

    form: {
        _GET: {},
        dtProv: {},
        formEmpleado: null,
        elements: null,
        btnSave: null,
        
        init()
        {
            this.formEmpleado = document.getElementById("form_empleado");
            this.btnSave = document.getElementById("btn_save");
            this.setEvents();
            this.setKeyboardShortcuts();
        },

        setEvents()
        {
            if (this.btnSave) { this.btnSave.addEventListener("click", () => { this.saveForm(); }); }
            if (this.formEmpleado) {
                this.elements = this.formEmpleado.elements;
            }
        },

        setKeyboardShortcuts()
        {
            document.addEventListener("keydown", (e) => {
                // console.log("key: "+ e.key + " | " + "code: " + e.code);
                if (e.key === "Escape") {
                    // Salir
                    e.preventDefault();
                    window.location.href = (empleado.path) ? empleado.path : "../";
                }
                if (e.key === "F2") {
                    // Agregar nuevo
                    e.preventDefault();
                    if (this._GET["_entity_id"] != "_new") empleado.add();
                }
                if (e.key === "F6") {
                    // Guardar
                    e.preventDefault();
                    this.elements["shortcut"].value = "F6";
                    this.saveForm();
                }
                if (e.key === "F8") {
                    // Guardar y salir
                    e.preventDefault();
                    this.elements["shortcut"].value = "F8";
                    this.saveForm();
                }
                if (e.key === "F9") {
                    // Guardar y nuevo
                    e.preventDefault();
                    this.elements["shortcut"].value = "F9";
                    this.saveForm();
                }
            });
        },

        saveForm(){
            if (!this.formEmpleado.reportValidity()) return;
            this.formEmpleado.submit();
        },
    },
}