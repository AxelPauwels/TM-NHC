import {Component, OnInit} from '@angular/core';
import {Taskv2CategoryService} from "../../../services/taskv2-category.service";
import {Observable} from "rxjs/Observable";
import {ConfigurationTaskV2CategoryViewModel} from "../../../models/viewmodels/configuration-task-v2-category-view-model";
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ConfigurationTaskCategoriesEditComponent} from "./configuration-task-categories-edit/configuration-task-categories-edit.component";
import {ConfigurationTaskCategoriesDeleteComponent} from "./configuration-task-categories-delete/configuration-task-categories-delete.component";

@Component({
  selector: 'app-configuration-task-categories',
  templateUrl: './configuration-task-categories.component.html',
  styleUrls: ['./configuration-task-categories.component.css']
})

export class ConfigurationTaskCategoriesComponent implements OnInit {

  constructor(private taskv2CategoryService: Taskv2CategoryService, private bsModalService: BsModalService) {
  }

  bsModalRef: BsModalRef;
  taskCategories: Observable<ConfigurationTaskV2CategoryViewModel[]>;

  ngOnInit() {
    this.loadCategories();
    this.bsModalService.onHide.subscribe(this.onHideModal.bind(this));
  }

  onHideModal(): void {
    if (this.bsModalRef == null)
      return;
    if (this.bsModalRef.content instanceof ConfigurationTaskCategoriesEditComponent && this.bsModalRef.content.taskCategory != undefined && this.bsModalRef.content.taskCategory.id != undefined && this.bsModalRef.content.isNew) {
      this.loadCategories();
      console.log(this.bsModalRef.content.taskCategory);
    }
    else if (this.bsModalRef.content instanceof ConfigurationTaskCategoriesDeleteComponent && this.bsModalRef.content.deleteSuccess)
      this.loadCategories();
  }

  loadCategories(): void {
    this.taskCategories = this.taskv2CategoryService.getAllTaskV2CategoriesConfigurationViewModels();
  }

  onClickEdit(category): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationTaskCategoriesEditComponent, {initialState: {taskCategory: category}});
  }

  onClickDelete(category): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationTaskCategoriesDeleteComponent, {initialState: {taskCategory: category}});
  }

  onClickAdd(): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationTaskCategoriesEditComponent, {initialState: {taskCategory: undefined}});
  }

}
