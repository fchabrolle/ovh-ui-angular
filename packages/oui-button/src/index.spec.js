describe('ouiButton', () => {
  let $componentController
  let testUtils

  beforeEach(angular.mock.module('oui.button'))
  beforeEach(angular.mock.module('oui.test-utils'))

  beforeEach(inject((_$componentController_, _TestUtils_) => {
    $componentController = _$componentController_
    testUtils = _TestUtils_
  }))

  describe('Controller', () => {
    it('should exist', () => {
      const ctrl = $componentController('ouiButton', {
        $attrs: {},
        $element: {},
        $log: {}
      })

      expect(ctrl).toBeDefined()
    })
  })

  describe('Component', () => {
    it('should display a button with value of attribute text, and is type="button" by default', () => {
      const component = testUtils.compileTemplate('<oui-button text="foo"></oui-button>')
      const button = component.element.find('button').eq(0)

      expect(button.text().trim()).toBe('foo')
      expect(button.attr('type')).toBe('button')
    })

    it('should have an attribute id and name on the button, and removed on the root component', () => {
      const component = testUtils.compileTemplate('<oui-button id="foo" name="bar"></oui-button>')
      const button = component.element.find('button').eq(0)

      expect(component.element.attr('id')).toBe(undefined)
      expect(button.attr('id')).toBe('foo')

      expect(component.element.attr('name')).toBe(undefined)
      expect(button.attr('name')).toBe('bar')
    })

    it('should have an attribute aria-label on the button, and removed on the root component', () => {
      const component = testUtils.compileTemplate('<oui-button aria-label="foo"></oui-button>')

      expect(component.element.attr('aria-label')).toBe(undefined)
      expect(component.element.find('button').eq(0).attr('aria-label')).toBe('foo')
    })

    it('should have a primary next step button', () => {
      const component = testUtils.compileTemplate('<oui-button text="foo" variant="primary" variant-nav="next"></oui-button>')
      const button = component.element.find('button').eq(0)

      expect(button.hasClass('oui-button_primary')).toBe(true)
      expect(button.hasClass('oui-button_icon-right')).toBe(true)
    })

    it('should have a disabled submit button', () => {
      const component = testUtils.compileTemplate('<oui-button text="foo" type="submit" disabled></oui-button>')
      const button = component.element.find('button').eq(0)

      expect(button.attr('disabled')).toBe('disabled')
      expect(button.attr('type')).toBe('submit')
    })

    it('should call function of onClick attribute, when button is clicked', () => {
      const component = testUtils.compileTemplate('<oui-button text="foo" on-click="$ctrl.onClickTest()"></oui-button>', {
        onClickTest: jasmine.createSpy('onClick')
      })

      component.element.find('button').eq(0).triggerHandler('click')
      expect(component.scope.$ctrl.onClickTest).toHaveBeenCalled()
    })
  })
})
