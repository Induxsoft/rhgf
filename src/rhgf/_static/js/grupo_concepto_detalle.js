var grupo_concepto_detalle =
{
    table:null, ik_conceptos:null, group_pk:0, url:'',

    init()
    {
        this.table = document.querySelector('#table_conceptos');
        this.ik_conceptos = document.querySelector('#ik_concepto');
        const btn_add_concepto = document.querySelector('#btn_add_concepto');
        const btn_save = document.querySelector('#btn_save');

        if (btn_add_concepto) btn_add_concepto.addEventListener('click', () => this.open_modal_search_concepto());
        if (this.ik_conceptos) this.ik_conceptos.addEventListener('change', data => this.add_concepto(data));
        if (btn_save) btn_save.addEventListener('click', () => this.save_changes());
        if (this.table) this.set_table_configs();
    },
    set_table_configs()
    {
        this.table.AutoAddRow = false;
        this.table.AutoDelRow = false;
        this.table.EverMove = false;
    },
    open_modal_search_concepto()
    {
        if (!this.ik_conceptos) return;

        this.ik_conceptos.searchText('',false);
    },
    add_concepto(concepto)
    {
        if (!concepto || !this.table) return;

        this.table.DataArray.push(concepto);
        this.table._printRows();
    },
    save_changes()
    {
        let data =
        {
            grupo: this.group_pk,
            conceptos: this.table.DataArray
        }

        InduxsoftCrudlModel.InvokeService(this.url, data,
            success => { window.location.href = this.url + '?group=' + this.group_pk },
            failure => { alert('No fué posible guardar los conceptos\n\n'+(failure.message??JSON.stringify(failure))); },
            "POST", false
        );
    }
}
document.addEventListener('DOMContentLoaded', () => {
    grupo_concepto_detalle.init();
});