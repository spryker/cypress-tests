import BackofficePage from '../backoffice-page';
import ExportRepository from './export-repository';

export default class ExportPage extends BackofficePage {
    exportRepository: ExportRepository;

    constructor() {
        super();
        this.exportRepository = new ExportRepository();
    }

    protected path = '/data-export-gui';

    /**
     * Exports a template for a given export type.
     *
     * Assumes that user is logged in.
     */
    exportTemplate(exportType: string) {
        this.visit();
        this.exportRepository.exportTypeSelect().select(exportType);
        this.exportRepository.exportTemplateButton().click();
    }

    /**
     * Exports data for a given export type.
     *
     * Assumes that user is logged in.
     */
    exportData(exportType: string) {
        this.visit();
        this.exportRepository.exportTypeSelect().select(exportType);
        this.exportRepository.exportButton().click();
    }
}
