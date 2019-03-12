'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const dateformat = require('dateformat');
const gitP = require('simple-git/promise');
const util = require('util');
const createSymlink = require('create-symlink');
const { realpathSync } = require('fs');


const ADD_README = 'addreadme';
const ADD_GIT = 'addgit';

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the stupendous ${chalk.red('generator-stm-32')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname
      },
      {
        type: 'input',
        name: 'projectFolder',
        message: 'Your project folder',
        default: this.appname
      },
      {
        type: 'list',
        name: 'target',
        message: 'Target',
        choices: [
          {
            name: "STM32F103C8T6",
            value: "STM32F103C8T6"
          }
        ]
      },
      {
        type: 'confirm',
        name: 'isFreeRTOS',
        message: 'Use FreeRTOS?',
        default: false
      },
      {
        type: 'input',
        name: 'username',
        message: 'Your Username',
        store: true
      },
      {
        type: 'input',
        name: 'email',
        message: 'Your email',
        store: true
      },
      {
        type: 'checkbox',
        name: 'options',
        message: 'What more would you like?',
        choices: [
          {
            name: 'Add README.md',
            value: ADD_README,
            checked: false
          },
          {
            name: 'Add git',
            value: ADD_GIT,
            checked: false
          }]
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {

    let now = new Date();
    let strDate = dateformat(now, 'yyyy/dd/mm hh:MM:ss');
    var fileTokens = {
      projectName: this.props.projectName,
      projectFolder: this.props.projectFolder,
      email: this.props.email,
      username: this.props.username,
      datetime: strDate,
      target: this.props.target,
      isFreeRTOS: "n"
    };

    var files = [
      "/Makefile",
      "/.vscode/tasks.json",
      "/.vscode/launch.json",
      "/.vscode/c_cpp_properties.json",
      "/inc/stm32f1xx_it.h",
      "/src/main.c",
      "/src/stm32f1xx_it.c",
      "/src/syscalls.c",
      "/src/system_stm32f1xx.c",
      "/startup/startup_stm32.s",
      "/.clang-format",
      "/.gdbinit",
      "/README.md"
    ];

    var project = 'stm32project';

    if (this.props.isFreeRTOS == true) {
      project = project + '_rtos';
      files.push("/inc/FreeRTOSConfig.h");
    }

    files.forEach(file => {
      this.fs.copyTpl(
        this.templatePath(project + file),
        this.destinationPath(this.props.projectName + file),
        fileTokens
      );
    });

    if (this.props.options.includes(ADD_GIT)) {
      this.fs.copyTpl(
        this.templatePath(project + '/.gitignore'),
        this.destinationPath(this.props.projectName + '/.gitignore'),
        fileTokens
      );
    }

    if (this.props.options.includes(ADD_README)) {
      this.fs.copyTpl(
        this.templatePath(project + '/README.md'),
        this.destinationPath(this.props.projectName + '/README.md'),
        fileTokens
      );
    }

  }

  install() {
    // this.installDependencies();
    if (this.props.options.includes(ADD_GIT)) {
      const git = gitP('./' + this.props.projectName + '/');
      git.init();

      var message = util.format('      %s %s', chalk.green('git'), 'initialise');
      this.log(message);
    }

    var fs = require('fs');
    if (fs.existsSync('../libs')) {
      createSymlink('../../libs', './' + this.props.projectName + '/libs').then(() => {
        realpathSync('./' + this.props.projectName + '/libs');
      });
    }

  }
};
