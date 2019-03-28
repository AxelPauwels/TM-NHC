import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {Taskv2CategoryService} from "../../../../services/taskv2-category.service";
import {ConfigurationTaskV2CategoryViewModel} from "../../../../models/viewmodels/configuration-task-v2-category-view-model";

@Component({
  selector: 'app-configuration-task-categories-delete',
  templateUrl: './configuration-task-categories-delete.component.html',
  styleUrls: ['./configuration-task-categories-delete.component.css']
})
export class ConfigurationTaskCategoriesDeleteComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private taskv2CategoryService: Taskv2CategoryService) { }

  @Input()
  taskCategory: ConfigurationTaskV2CategoryViewModel;

  deleteSuccess: boolean;

  ngOnInit() {
  }

  onConfirm(): void {
    this.taskv2CategoryService.deleteTaskV2Category(this.taskCategory.id).subscribe(result => {
      this.deleteSuccess = true;
      this.bsModalRef.hide();
    });
  }

  onCancel(): void {
    this.bsModalRef.hide();
  }


}
