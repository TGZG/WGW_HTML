/**
 * ����������������
 * 1.Ĭ����ʾ������ħ�˵�����
 * 2.Ϊ��������ͼ����ӵ���¼�
 */
document.addEventListener('DOMContentLoaded', function () {
    // ����Ĭ����ʾ������
    showFaction('����');
    showFaction('ħ��');

    // Ϊ��������ͼ����ӵ���¼�
    const factionItems = document.querySelectorAll('.faction-item');
    factionItems.forEach(item => {
        item.addEventListener('click', function () {
            const factionName = this.getAttribute('data-faction');
            const parent = this.closest('.faction-container');
            showFaction(factionName, parent);
        });
    });

    // ��ʾָ������������
    function showFaction(factionName, container) {
        // ���û��ָ��������������������
        if (!container) {
            const containers = document.querySelectorAll('.faction-container');
            containers.forEach(cont => {
                const item = cont.querySelector(`.faction-item[data-faction="${factionName}"]`);
                if (item) {
                    showFaction(factionName, cont);
                }
            });
            return;
        }

        // ������������
        const allDetails = container.querySelectorAll('.detail-content');
        allDetails.forEach(detail => {
            detail.style.display = 'none';
        });

        // ��ʾѡ�е�����
        const selectedDetail = container.querySelector(`#${factionName}-detail`);
        if (selectedDetail) {
            selectedDetail.style.display = 'block';
        }

        // �Ƴ�����ѡ��״̬
        const allItems = container.querySelectorAll('.faction-item');
        allItems.forEach(item => {
            item.classList.remove('active');
        });

        // ���ѡ��״̬
        const selectedItem = container.querySelector(`.faction-item[data-faction="${factionName}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
    }
});