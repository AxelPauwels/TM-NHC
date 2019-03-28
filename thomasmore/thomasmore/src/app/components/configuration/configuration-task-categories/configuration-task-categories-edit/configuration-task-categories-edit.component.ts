import {Component, Input, OnInit} from '@angular/core';
import {ConfigurationTaskV2CategoryViewModel} from "../../../../models/viewmodels/configuration-task-v2-category-view-model";
import {BsModalRef} from "ngx-bootstrap";
import {Taskv2CategoryService} from "../../../../services/taskv2-category.service";

@Component({
  selector: 'app-configuration-task-categories-edit',
  templateUrl: './configuration-task-categories-edit.component.html',
  styleUrls: ['./configuration-task-categories-edit.component.css']
})
export class ConfigurationTaskCategoriesEditComponent implements OnInit {

    constructor(public bsModalRef: BsModalRef, private taskv2CategoryService: Taskv2CategoryService) {
  }

  @Input()
  taskCategory: ConfigurationTaskV2CategoryViewModel;

  name: string;
  isNew: boolean;

  ngOnInit() {
    if (this.taskCategory != undefined)
      this.name = this.taskCategory.name;
    else
    {
      this.name = '';
      this.isNew = true;
    }
  }

  onSaveCategory(): void {
    if (this.taskCategory == undefined) {
      this.taskv2CategoryService.createTaskV2Category({name: this.name}).subscribe(result => {
        this.taskCategory = result;
        this.bsModalRef.hide();
      });
    } else {
      this.taskv2CategoryService.updateTaskV2Category({id: this.taskCategory.id, name: this.name}).subscribe(result => {
        this.taskCategory.name = this.name;
        this.bsModalRef.hide();
      });
    }
  }

  onCancel(): void {
    this.bsModalRef.hide();
  }

  isValid(): boolean {
    return this.name != null && this.name.trim() != '';
  }

}
